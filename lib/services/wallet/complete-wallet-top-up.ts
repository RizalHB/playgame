import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  wallets,
  walletTopUps,
  walletTransactions,
} from "@/lib/database/schema";

export async function completeWalletTopUp(
  userId: string,
  topUpId: string,
) {
  return db.transaction(async (tx) => {
    // 1. Find the top-up.
    const topUp = await tx.query.walletTopUps.findFirst({
      where: eq(walletTopUps.id, topUpId),
    });

    if (!topUp) {
      throw new Error("Wallet top-up not found.");
    }

    // 2. Find the wallet associated with this top-up.
    const wallet = await tx.query.wallets.findFirst({
      where: eq(wallets.id, topUp.walletId),
    });

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    // 3. Security: the authenticated user must own the wallet.
    if (wallet.userId !== userId) {
      throw new Error(
        "You are not allowed to complete this top-up.",
      );
    }

    // 4. Wallet must be usable.
    if (wallet.status !== "active") {
      throw new Error("Wallet is not active.");
    }

    // 5. Idempotency:
    // If this top-up has already completed, never credit it again.
    if (topUp.status === "completed") {
      return {
        success: true,
        alreadyCompleted: true,
        topUpId: topUp.id,
        transactionReference:
          topUp.transactionReference,
        amount: topUp.amount,
        balance: wallet.balance,
      };
    }

    // 6. Only pending top-ups can be completed.
    if (topUp.status !== "pending") {
      throw new Error(
        `Top-up cannot be completed from status "${topUp.status}".`,
      );
    }

    /*
     * 7. Atomically claim the top-up.
     *
     * Only one transaction is allowed to change this
     * particular top-up from "pending" to "completed".
     *
     * If another request has already completed it,
     * this update returns no row.
     */
    const now = new Date();

    const [claimedTopUp] = await tx
      .update(walletTopUps)
      .set({
        status: "completed",
        paidAt: now,
        completedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(walletTopUps.id, topUp.id),
          eq(walletTopUps.walletId, wallet.id),
          eq(walletTopUps.status, "pending"),
        ),
      )
      .returning();

    if (!claimedTopUp) {
      /*
       * Another request may have completed this payment
       * between our initial read and this atomic update.
       *
       * Re-read the top-up so we can distinguish an already
       * completed payment from an unexpected failure.
       */
      const currentTopUp =
        await tx.query.walletTopUps.findFirst({
          where: eq(walletTopUps.id, topUp.id),
        });

      if (
        currentTopUp?.status === "completed"
      ) {
        const currentWallet =
          await tx.query.wallets.findFirst({
            where: eq(wallets.id, wallet.id),
          });

        return {
          success: true,
          alreadyCompleted: true,
          topUpId: topUp.id,
          transactionReference:
            topUp.transactionReference,
          amount: topUp.amount,
          balance:
            currentWallet?.balance ??
            wallet.balance,
        };
      }

      throw new Error(
        "Top-up could not be completed.",
      );
    }

    /*
     * 8. The top-up is now claimed by this transaction.
     *
     * From this point onward, this transaction owns the
     * settlement operation.
     */
    const balanceBefore = wallet.balance;
    const balanceAfter =
      balanceBefore + claimedTopUp.amount;

    // 9. Credit the wallet.
    await tx
      .update(wallets)
      .set({
        balance: balanceAfter,
        updatedAt: now,
      })
      .where(
        and(
          eq(wallets.id, wallet.id),
          eq(wallets.userId, userId),
        ),
      );

    /*
     * 10. Create the immutable wallet ledger entry.
     *
     * transactionKey is UNIQUE and therefore provides
     * another database-level protection against duplicate
     * settlement.
     */
    await tx.insert(walletTransactions).values({
      id: crypto.randomUUID(),

      walletId: wallet.id,

      type: "top_up",

      amount: claimedTopUp.amount,

      balanceBefore,

      balanceAfter,

      referenceType: "wallet_top_up",

      referenceId: claimedTopUp.id,

      transactionKey:
        `wallet-topup-completed:${claimedTopUp.id}`,

      description:
        `Wallet top-up via QRIS (${claimedTopUp.transactionReference})`,

      status: "completed",
    });

    return {
      success: true,
      alreadyCompleted: false,
      topUpId: claimedTopUp.id,
      transactionReference:
        claimedTopUp.transactionReference,
      amount: claimedTopUp.amount,
      balanceBefore,
      balanceAfter,
      balance: balanceAfter,
    };
  });
}