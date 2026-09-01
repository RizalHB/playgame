"use server";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { createWalletTopUp } from "@/lib/services/wallet/wallet-top-up-service";
import { completeWalletTopUp } from "@/lib/services/wallet/complete-wallet-top-up";
import { generateWalletPaymentQr } from "@/lib/services/wallet/generate-wallet-payment-qr";

import {
  getWalletTopUpByPaymentToken,
} from "@/lib/database/queries/wallet-payment";

export async function createTopUp(
  amount: number,
  idempotencyKey: string,
) {
  const result = await createWalletTopUp(
    amount,
    idempotencyKey,
  );

  const qr =
    await generateWalletPaymentQr(
      result.topUp.paymentToken,
    );

  return {
    ...result,

    payment: {
      paymentUrl: qr.paymentUrl,
      qrDataUrl: qr.qrDataUrl,
      method: result.topUp.paymentMethod,
      provider: result.topUp.provider,
      transactionReference:
        result.topUp.transactionReference,
      amount: result.topUp.amount,
      currency: result.topUp.currency,
      status: result.topUp.status,
    },
  };
}

/**
 * Authenticated wallet-owner completion.
 *
 * Used by internal wallet flows where the user is
 * already authenticated.
 */
export async function simulateQrisPayment(
  topUpId: string,
) {
  const userId =
    await getCurrentUserId();

  return completeWalletTopUp(
    userId,
    topUpId,
  );
}

/**
 * Public QR/payment-session completion.
 *
 * IMPORTANT:
 * paymentToken is the payment-session credential.
 * It must never be treated as a user ID.
 *
 * The wallet owner is resolved server-side from
 * the top-up record.
 */
export async function confirmQrisPayment(
  paymentToken: string,
) {
  if (!paymentToken?.trim()) {
    throw new Error(
      "Payment token is required.",
    );
  }

  const result =
    await getWalletTopUpByPaymentToken(
      paymentToken,
    );

  if (!result) {
    throw new Error(
      "Payment session not found.",
    );
  }

  const { topUp } = result;

  /*
   * Idempotency:
   * reopening an already completed payment
   * must never credit the wallet again.
   */
  if (topUp.status === "completed") {
    return {
      success: true,
      alreadyCompleted: true,
      topUp,
      wallet: result.wallet,
    };
  }

  if (topUp.status !== "pending") {
    throw new Error(
      `Payment cannot be completed from status "${topUp.status}".`,
    );
  }

  /*
   * Resolve the real wallet owner from the
   * payment session server-side.
   *
   * No userId comes from the browser.
   */
  return completeWalletTopUp(
    result.wallet.userId,
    topUp.id,
  );
}