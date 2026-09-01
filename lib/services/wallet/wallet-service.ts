import { eq } from "drizzle-orm";

import {
  wallets,
  walletTransactions,
} from "@/lib/database/schema";

import { db } from "@/lib/database/database";

type WalletMutation = {
  walletId: string;
  amount: number;
  type: string;
  transactionKey: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
};

export async function creditWallet(
  input: WalletMutation
) {
  if (input.amount <= 0) {
    throw new Error(
      "Wallet credit amount must be greater than zero."
    );
  }

  return db.transaction(async (tx) => {
    const existingTransaction =
      await tx.query.walletTransactions.findFirst({
        where: eq(
          walletTransactions.transactionKey,
          input.transactionKey
        ),
      });

    if (existingTransaction) {
      return {
        success: true,
        alreadyProcessed: true,
        transaction: existingTransaction,
      };
    }

    const wallet =
      await tx.query.wallets.findFirst({
        where: eq(
          wallets.id,
          input.walletId
        ),
      });

    if (!wallet) {
      throw new Error(
        "Wallet not found."
      );
    }

    if (wallet.status !== "active") {
      throw new Error(
        "Wallet is not active."
      );
    }

    const balanceBefore =
      wallet.balance;

    const balanceAfter =
      balanceBefore + input.amount;

    const transactionId =
      crypto.randomUUID();

    const now = new Date();

    await tx
      .update(wallets)
      .set({
        balance: balanceAfter,
        updatedAt: now,
      })
      .where(
        eq(
          wallets.id,
          wallet.id
        )
      );

    const transaction =
      await tx
        .insert(walletTransactions)
        .values({
          id: transactionId,
          walletId: wallet.id,
          type: input.type,
          amount: input.amount,
          balanceBefore,
          balanceAfter,
          referenceType:
            input.referenceType,
          referenceId:
            input.referenceId,
          transactionKey:
            input.transactionKey,
          description:
            input.description,
          status: "completed",
          createdAt: now,
          updatedAt: now,
        })
        .returning();

    return {
      success: true,
      alreadyProcessed: false,
      transaction:
        transaction[0],
    };
  });
}