import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  wallets,
  walletTransactions,
  walletTopUps,
} from "@/lib/database/schema";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function getCurrentWallet() {
  const userId = await getCurrentUserId();

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  return wallet ?? null;
}

export async function getCurrentWalletTransactions() {
  const userId = await getCurrentUserId();

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    return [];
  }

  return db.query.walletTransactions.findMany({
    where: eq(walletTransactions.walletId, wallet.id),
    orderBy: [desc(walletTransactions.createdAt)],
  });
}

export async function getCurrentWalletTopUps() {
  const userId = await getCurrentUserId();

  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    return [];
  }

  return db.query.walletTopUps.findMany({
    where: eq(walletTopUps.walletId, wallet.id),
    orderBy: [desc(walletTopUps.createdAt)],
  });
}