import {
  and,
  eq,
  gte,
  inArray,
  lte,
} from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  discounts,
  games,
  libraries,
  orderItems,
  orders,
  shoppingCartItems,
  shoppingCarts,
  walletTransactions,
  wallets,
} from "@/lib/database/schema";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { calculateCartPrices } from "../pricing/calculate-cart-prices";
import { generateOrderNumber } from "@/lib/utils/order-number";

export async function createOrder() {
  /*
   * The authenticated user is resolved on the server.
   *
   * The browser never supplies the user ID.
   */
  const userId =
    await getCurrentUserId();

  return db.transaction(async (tx) => {
    const now = new Date();

    /*
     * 1. Load the user's cart.
     */
    const cart =
      await tx.query.shoppingCarts.findFirst({
        where: eq(
          shoppingCarts.userId,
          userId,
        ),
      });

    if (!cart) {
      throw new Error(
        "Shopping cart not found.",
      );
    }

    /*
     * 2. Load cart items.
     */
    const cartItems =
      await tx.query.shoppingCartItems.findMany({
        where: eq(
          shoppingCartItems.cartId,
          cart.id,
        ),
      });

    if (cartItems.length === 0) {
      throw new Error(
        "Shopping cart is empty.",
      );
    }

    /*
     * Remove duplicate game IDs defensively.
     */
    const gameIds = [
      ...new Set(
        cartItems.map(
          (item) => item.gameId,
        ),
      ),
    ];

    /*
     * 3. Load every game through the
     * transaction.
     */
    const gameRows =
      await tx.query.games.findMany({
        where: inArray(
          games.id,
          gameIds,
        ),
      });

    /*
     * Every cart game must still exist.
     */
    if (
      gameRows.length !==
      gameIds.length
    ) {
      throw new Error(
        "One or more games in the cart are no longer available.",
      );
    }

    /*
     * 4. Prevent purchasing games already
     * owned by this user.
     *
     * No financial mutation has happened yet.
     */
    const existingLibraryEntries =
      await tx.query.libraries.findMany({
        where: and(
          eq(
            libraries.userId,
            userId,
          ),
          inArray(
            libraries.gameId,
            gameIds,
          ),
        ),
      });

    if (
      existingLibraryEntries.length > 0
    ) {
      throw new Error(
        "One or more games are already in your library. Remove them from your cart before purchasing.",
      );
    }

    /*
     * 5. Load currently active discounts
     * through the same transaction.
     */
    const discountRows =
      await tx.query.discounts.findMany({
        where: and(
          inArray(
            discounts.gameId,
            gameIds,
          ),
          eq(
            discounts.isActive,
            true,
          ),
          lte(
            discounts.startDate,
            now,
          ),
          gte(
            discounts.endDate,
            now,
          ),
        ),
      });

    /*
     * 6. Calculate authoritative prices.
     *
     * Never trust price information supplied
     * by the browser.
     */
    const prices =
      await calculateCartPrices(
        gameRows,
        discountRows,
      );

    if (
      prices.length !==
      gameIds.length
    ) {
      throw new Error(
        "Unable to calculate prices for all cart items.",
      );
    }

    const subtotal =
      prices.reduce(
        (sum, item) =>
          sum + item.unitPrice,
        0,
      );

    const totalAmount =
      prices.reduce(
        (sum, item) =>
          sum + item.finalPrice,
        0,
      );

    const discountAmount =
      subtotal -
      totalAmount;

    /*
     * Wallet balances are stored as integer
     * IDR amounts, so the final purchase total
     * must also be an integer.
     */
    if (
      !Number.isFinite(
        totalAmount,
      ) ||
      totalAmount <= 0 ||
      !Number.isInteger(
        totalAmount,
      )
    ) {
      throw new Error(
        "Invalid order total.",
      );
    }

    /*
     * 7. Load the active wallet.
     */
    const wallet =
      await tx.query.wallets.findFirst({
        where: and(
          eq(
            wallets.userId,
            userId,
          ),
          eq(
            wallets.status,
            "active",
          ),
        ),
      });

    if (!wallet) {
      throw new Error(
        "Active wallet not found.",
      );
    }

    /*
     * 8. Check wallet balance before
     * creating any financial mutation.
     */
    if (
      wallet.balance <
      totalAmount
    ) {
      throw new Error(
        "Insufficient wallet balance.",
      );
    }

    const balanceBefore =
      wallet.balance;

    const balanceAfter =
      balanceBefore -
      totalAmount;

    if (
      balanceAfter < 0
    ) {
      throw new Error(
        "Insufficient wallet balance.",
      );
    }

    /*
     * 9. Create the order.
     *
     * It remains pending until the wallet
     * debit, ledger, and library entitlement
     * all succeed.
     */
    const orderId =
      crypto.randomUUID();

    const orderNumber =
      generateOrderNumber();

    await tx
      .insert(orders)
      .values({
        id: orderId,

        userId,

        orderNumber,

        subtotal,

        discountAmount,

        totalAmount,

        status: "pending",

        createdAt: now,

        updatedAt: now,
      });

    /*
     * 10. Snapshot the authoritative prices
     * into the order items.
     */
    await tx
      .insert(orderItems)
      .values(
        prices.map((price) => {
        const developerAmount = Math.floor(price.finalPrice * 0.9);
        const platformAmount = price.finalPrice - developerAmount;

        return {
          id: crypto.randomUUID(),
          orderId,
          gameId: price.gameId,
          gameTitle: price.title,
          unitPrice: price.unitPrice,
          discountPercentage: price.discountPercentage,
          finalPrice: price.finalPrice,
          developerAmount,
          platformAmount,
          createdAt: now,
          updatedAt: now,
        };
      }),
      );

    /*
     * 11. Unique financial transaction key.
     *
     * This gives every completed order exactly
     * one wallet ledger identity.
     */
    const transactionKey =
      `purchase:${orderId}`;

    /*
     * Defensive duplicate check.
     */
    const existingTransaction =
      await tx.query.walletTransactions.findFirst(
        {
          where: eq(
            walletTransactions.transactionKey,
            transactionKey,
          ),
        },
      );

    if (existingTransaction) {
      throw new Error(
        "Purchase transaction already exists.",
      );
    }

    /*
     * 12. Atomically debit the wallet.
     *
     * The balance condition is important.
     *
     * If another purchase changed the wallet
     * between our read and this update, this
     * update affects zero rows and the entire
     * transaction rolls back.
     */
    const updatedWallet =
      await tx
        .update(wallets)
        .set({
          balance:
            balanceAfter,

          updatedAt:
            now,
        })
        .where(
          and(
            eq(
              wallets.id,
              wallet.id,
            ),

            eq(
              wallets.userId,
              userId,
            ),

            eq(
              wallets.status,
              "active",
            ),

            eq(
              wallets.balance,
              balanceBefore,
            ),
          ),
        )
        .returning();

    if (
      updatedWallet.length !==
      1
    ) {
      throw new Error(
        "Wallet balance changed before purchase completion. Please retry.",
      );
    }

    /*
     * 13. Immutable wallet debit ledger.
     *
     * Positive wallet transaction amounts are
     * used for top-ups.
     *
     * Purchase transactions use a negative
     * amount because money is leaving the wallet.
     */
    const [
      transaction,
    ] = await tx
      .insert(walletTransactions)
      .values({
        id: crypto.randomUUID(),

        walletId:
          wallet.id,

        type: "purchase",

        amount:
          -totalAmount,

        balanceBefore,

        balanceAfter,

        referenceType:
          "order",

        referenceId:
          orderId,

        transactionKey,

        description:
          `Game purchase ${orderNumber}`,

        status:
          "completed",

        createdAt: now,

        updatedAt: now,
      })
      .returning();

    if (!transaction) {
      throw new Error(
        "Failed to create wallet transaction.",
      );
    }

    /*
     * 14. Grant library entitlement.
     *
     * libraries.user_id + libraries.game_id
     * has a UNIQUE constraint.
     *
     * Therefore the database also protects
     * against duplicate ownership.
     */
    await tx
      .insert(libraries)
      .values(
        prices.map(
          (price) => ({
            id: crypto.randomUUID(),

            userId,

            gameId:
              price.gameId,

            purchasedAt: now,

            playTimeMinutes: 0,

            createdAt: now,

            updatedAt: now,
          }),
        ),
      );

    /*
     * 15. Remove purchased games from cart.
     */
    await tx
      .delete(
        shoppingCartItems,
      )
      .where(
        eq(
          shoppingCartItems.cartId,
          cart.id,
        ),
      );

    /*
     * 16. Complete the order only after
     * every previous operation succeeded.
     */
    const [
      completedOrder,
    ] = await tx
      .update(orders)
      .set({
        status:
          "completed",

        completedAt:
          now,

        updatedAt:
          now,
      })
      .where(
        and(
          eq(
            orders.id,
            orderId,
          ),

          eq(
            orders.userId,
            userId,
          ),

          eq(
            orders.status,
            "pending",
          ),
        ),
      )
      .returning();

    if (
      !completedOrder
    ) {
      throw new Error(
        "Order state changed before purchase completion.",
      );
    }

    /*
     * 17. Return authoritative state.
     */
    return {
      success: true,

      orderId,

      orderNumber,

      subtotal,

      discountAmount,

      totalAmount,

      wallet: {
        id:
          updatedWallet[0].id,

        balance:
          updatedWallet[0]
            .balance,

        currency:
          updatedWallet[0]
            .currency,

        status:
          updatedWallet[0]
            .status,
      },

      transaction,

      games: prices.map(
        (price) => ({
          gameId:
            price.gameId,

          title:
            price.title,

          finalPrice:
            price.finalPrice,
        }),
      ),
    };
  });
}