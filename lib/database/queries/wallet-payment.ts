import { eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  walletTopUps,
  wallets,
} from "@/lib/database/schema";

export async function getWalletTopUpByPaymentToken(
  paymentToken: string,
) {
  const normalizedToken =
    paymentToken.trim();

  if (!normalizedToken) {
    return null;
  }

  const topUp =
    await db.query.walletTopUps.findFirst({
      where: eq(
        walletTopUps.paymentToken,
        normalizedToken,
      ),
    });

  if (!topUp) {
    return null;
  }

  const wallet =
    await db.query.wallets.findFirst({
      where: eq(
        wallets.id,
        topUp.walletId,
      ),
    });

  if (!wallet) {
    return null;
  }

  return {
    topUp,
    wallet,
  };
}