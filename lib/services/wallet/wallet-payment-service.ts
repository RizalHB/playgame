import { and, eq } from "drizzle-orm";
import { db } from "@/lib/database/database";
import {
  walletTopUps,
} from "@/lib/database/schema";
import { getCurrentUserId } from "@/lib/auth/current-user";
import {
  completeWalletTopUp,
} from "./wallet-top-up-service";
export async function confirmWalletTopUpPayment(
  topUpId: string
) {
  const userId =
    await getCurrentUserId();

  const topUp =
    await db.query.walletTopUps.findFirst({
      where: eq(
        walletTopUps.id,
        topUpId
      ),
      with: {
        wallet: true,
      },
    });

  if (!topUp) {
    throw new Error(
      "Wallet top-up not found."
    );
  }

  if (topUp.wallet.userId !== userId) {
    throw new Error(
      "You cannot confirm this top-up."
    );
  }

  if (topUp.status === "completed") {
    return {
      success: true,
      alreadyCompleted: true,
      topUp,
    };
  }

  if (topUp.status !== "pending") {
    throw new Error(
      `Top-up cannot be confirmed from status "${topUp.status}".`
    );
  }

  if (topUp.paymentMethod !== "qris") {
    throw new Error(
      "This payment is not a QRIS payment."
    );
  }

  /*
   * Fictional payment-provider confirmation.
   *
   * In a production system this state would normally
   * come from a verified payment-provider webhook.
   */
  const now = new Date();

  await db
    .update(walletTopUps)
    .set({
      status: "paid",
      paidAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(
          walletTopUps.id,
          topUpId
        ),
        eq(
          walletTopUps.walletId,
          topUp.walletId
        )
      )
    );

  return completeWalletTopUp(
    topUpId
  );
}