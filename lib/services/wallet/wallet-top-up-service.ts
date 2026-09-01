"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  wallets,
  walletTopUps,
  walletTransactions,
} from "@/lib/database/schema";
import { getCurrentUserId } from "@/lib/auth/current-user";

const MIN_TOP_UP_AMOUNT = 10_000;
const MAX_TOP_UP_AMOUNT = 10_000_000;
const PAYMENT_SESSION_TTL_MS =
  30 * 1000;

function generateTransactionReference() {
  return `QRIS-PLAYGAME-${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
}

export async function createWalletTopUp(
  amount: number,
  idempotencyKey: string,
) {
  const userId = await getCurrentUserId();

  if (!Number.isSafeInteger(amount)) {
    throw new Error(
      "Top-up amount must be a whole number.",
    );
  }

  if (
    amount < MIN_TOP_UP_AMOUNT ||
    amount > MAX_TOP_UP_AMOUNT
  ) {
    throw new Error(
      `Top-up amount must be between Rp ${MIN_TOP_UP_AMOUNT.toLocaleString(
        "id-ID",
      )} and Rp ${MAX_TOP_UP_AMOUNT.toLocaleString(
        "id-ID",
      )}.`,
    );
  }

  if (!idempotencyKey.trim()) {
    throw new Error(
      "Idempotency key is required.",
    );
  }

  return db.transaction(async (tx) => {
    const wallet =
      await tx.query.wallets.findFirst({
        where: eq(
          wallets.userId,
          userId,
        ),
      });

    if (!wallet) {
      throw new Error(
        "Wallet not found.",
      );
    }

    if (wallet.status !== "active") {
      throw new Error(
        "Wallet is not active.",
      );
    }

    /*
     * Idempotency:
     * Reusing the same request key must return
     * the original top-up instead of creating
     * another payment session.
     */
    const existingTopUp =
      await tx.query.walletTopUps.findFirst({
        where: eq(
          walletTopUps.idempotencyKey,
          idempotencyKey,
        ),
      });

    if (existingTopUp) {
      if (
        existingTopUp.walletId !== wallet.id
      ) {
        throw new Error(
          "Invalid idempotency key.",
        );
      }

      return {
        success: true,
        alreadyExists: true,
        topUp: existingTopUp,
      };
    }

    const topUpId =
      crypto.randomUUID();

    const transactionReference =
      generateTransactionReference();

    /*
     * Payment token is a payment-session
     * credential. It must never represent
     * the wallet/user directly.
     */
    const paymentToken = crypto.randomUUID();

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + 30_000,
    );

    const topUp = {
      id: topUpId,
      walletId: wallet.id,
      amount,
      currency: wallet.currency,
      paymentMethod: "qris",
      provider: "playgame_qris_simulator",
      status: "pending",
      transactionReference,
      idempotencyKey,
      paymentToken,
      expiresAt,
    };

    await tx
      .insert(walletTopUps)
      .values(topUp);

    return {
      success: true,
      alreadyExists: false,
      topUp,
    };
  });
}

export async function completeWalletTopUp(
  topUpId: string,
) {
  const userId =
    await getCurrentUserId();

  return db.transaction(async (tx) => {
    /*
     * 1. Find the top-up.
     */
    const topUp =
      await tx.query.walletTopUps.findFirst({
        where: eq(
          walletTopUps.id,
          topUpId,
        ),
      });

    if (!topUp) {
      throw new Error(
        "Wallet top-up not found.",
      );
    }

    /*
     * 2. Resolve the wallet through:
     *
     * wallet ID + authenticated user ID.
     *
     * The browser never supplies userId.
     */
    const wallet =
      await tx.query.wallets.findFirst({
        where: and(
          eq(
            wallets.id,
            topUp.walletId,
          ),
          eq(
            wallets.userId,
            userId,
          ),
        ),
      });

    if (!wallet) {
      throw new Error(
        "Wallet not found.",
      );
    }

    if (wallet.status !== "active") {
      throw new Error(
        "Wallet is not active.",
      );
    }

    /*
     * 3. Idempotency:
     *
     * A completed top-up is already settled.
     * Never credit it again.
     */
    if (topUp.status === "completed") {
      return {
        success: true,
        alreadyCompleted: true,
        topUp,
        wallet,
      };
    }
    if (
        topUp.status === "pending" &&
        topUp.expiresAt &&
        topUp.expiresAt.getTime() <= Date.now()
      ) {
        const now = new Date();

        const [expiredTopUp] =
          await tx
            .update(walletTopUps)
            .set({
              status: "expired",
              failureReason:
                "Payment session expired.",
              updatedAt: now,
            })
            .where(
              and(
                eq(
                  walletTopUps.id,
                  topUp.id,
                ),
                eq(
                  walletTopUps.status,
                  "pending",
                ),
              ),
            )
            .returning();

        return {
          success: false,
          expired: true,
          alreadyCompleted: false,
          topUp:
            expiredTopUp ?? {
              ...topUp,
              status: "expired",
            },
          wallet,
        };
      }
    /*
     * 4. Only pending/paid payments may
     * become wallet credits.
     */
    if (
      topUp.status !== "pending" &&
      topUp.status !== "paid"
    ) {
      throw new Error(
        `Top-up cannot be completed from status "${topUp.status}".`,
      );
    }

    if (topUp.amount <= 0) {
      throw new Error(
        "Invalid top-up amount.",
      );
    }

    const transactionKey =
      `topup:${topUp.id}`;

    /*
     * 5. Database-level ledger idempotency.
     *
     * transactionKey is UNIQUE in
     * wallet_transactions.
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
      const now = new Date();

      await tx
        .update(walletTopUps)
        .set({
          status: "completed",
          paidAt:
            topUp.paidAt ?? now,
          completedAt:
            topUp.completedAt ?? now,
          updatedAt: now,
        })
        .where(
          and(
            eq(
              walletTopUps.id,
              topUp.id,
            ),
            eq(
              walletTopUps.status,
              topUp.status,
            ),
          ),
        );

      return {
        success: true,
        alreadyCompleted: true,
        topUp: {
          ...topUp,
          status: "completed",
          paidAt:
            topUp.paidAt ?? now,
          completedAt:
            topUp.completedAt ?? now,
        },
        wallet,
        transaction:
          existingTransaction,
      };
    }

    /*
     * 6. Calculate the new balance.
     */
    const balanceBefore =
      wallet.balance;

    const balanceAfter =
      balanceBefore + topUp.amount;

    const now = new Date();

    /*
     * 7. Atomically move the wallet balance
     * from the exact balance we read.
     *
     * If another transaction has already changed
     * this wallet, this conditional update will
     * affect zero rows.
     */
    const updatedWallet =
      await tx
        .update(wallets)
        .set({
          balance: balanceAfter,
          updatedAt: now,
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
              wallets.balance,
              balanceBefore,
            ),
            eq(
              wallets.status,
              "active",
            ),
          ),
        )
        .returning();

    if (updatedWallet.length !== 1) {
      throw new Error(
        "Wallet balance changed before payment completion. Please retry.",
      );
    }

    /*
     * 8. Create the immutable ledger entry.
     *
     * transactionKey is UNIQUE, so this top-up
     * can never create a second ledger record.
     */
    let transaction;

    try {
      [transaction] =
        await tx
          .insert(walletTransactions)
          .values({
            id: crypto.randomUUID(),

            walletId:
              wallet.id,

            type: "top_up",

            amount:
              topUp.amount,

            balanceBefore,

            balanceAfter,

            referenceType:
              "wallet_top_up",

            referenceId:
              topUp.id,

            transactionKey,

            description:
              `Wallet top-up via ${topUp.provider}`,

            status:
              "completed",

            createdAt: now,

            updatedAt: now,
          })
          .returning();
    } catch (error) {
      /*
       * The unique transactionKey is the final
       * database-level protection against a
       * duplicate ledger entry.
       *
       * The surrounding transaction will roll
       * back the wallet balance if this insert
       * fails.
       */
      throw error;
    }

    /*
     * 9. Complete the payment only if it is
     * still pending/paid.
     *
     * This makes the state transition explicit.
     */
    const completedTopUps =
      await tx
        .update(walletTopUps)
        .set({
          status:
            "completed",

          paidAt:
            topUp.paidAt ??
            now,

          completedAt:
            now,

          updatedAt:
            now,
        })
        .where(
          and(
            eq(
              walletTopUps.id,
              topUp.id,
            ),
            eq(
              walletTopUps.status,
              topUp.status,
            ),
          ),
        )
        .returning();

    if (
      completedTopUps.length !== 1
    ) {
      throw new Error(
        "Top-up state changed before completion. Payment was not finalized.",
      );
    }

    const completedTopUp =
      completedTopUps[0];

    /*
     * 10. Return the authoritative
     * completed state.
     */
    return {
      success: true,
      alreadyCompleted: false,

      topUp:
        completedTopUp,

      wallet:
        updatedWallet[0],

      transaction,
    };
  });
}