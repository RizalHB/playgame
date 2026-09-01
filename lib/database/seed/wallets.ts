import { eq } from "drizzle-orm";

import { db } from "../database";
import {
  roles,
  users,
  wallets,
  walletTransactions,
} from "../schema";

const INITIAL_BALANCES: Record<
  string,
  number
> = {
  "gamer@playgame.local": 250_000,
  "gordon@playgame.local": 100_000,
  "alyx@playgame.local": 100_000,
  "barney@playgame.local": 100_000,
  "eli@playgame.local": 100_000,
  "chell@playgame.local": 100_000,
  "wheatley@playgame.local": 100_000,
  "glados@playgame.local": 100_000,
  "coach@playgame.local": 100_000,
  "ellis@playgame.local": 100_000,
  "zoey@playgame.local": 100_000,
  "cssveteran@playgame.local": 100_000,
  "headshotpro@playgame.local": 100_000,
  "lambdaone@playgame.local": 100_000,
  "pixelhunter@playgame.local": 100_000,
};

export async function seedWallets(
  seededUsers: typeof users.$inferSelect[]
) {
  const gamerRole =
    await db.query.roles.findFirst({
      where: eq(
        roles.name,
        "Gamer"
      ),
    });

  if (!gamerRole) {
    throw new Error(
      "Gamer role not found while seeding wallets."
    );
  }

  const gamerUsers = seededUsers.filter(
    (user) =>
      user.roleId === gamerRole.id
  );

  for (const user of gamerUsers) {
    const existingWallet =
      await db.query.wallets.findFirst({
        where: eq(
          wallets.userId,
          user.id
        ),
      });

    if (existingWallet) {
      continue;
    }

    const initialBalance =
      INITIAL_BALANCES[user.email] ?? 0;

    await db.transaction(async (tx) => {
      const walletId =
        crypto.randomUUID();

      await tx.insert(wallets).values({
        id: walletId,
        userId: user.id,
        balance: initialBalance,
        currency: "IDR",
        status: "active",
      });

      if (initialBalance > 0) {
        await tx
          .insert(walletTransactions)
          .values({
            id: crypto.randomUUID(),
            walletId,
            type: "initial_credit",
            amount: initialBalance,
            balanceBefore: 0,
            balanceAfter: initialBalance,
            referenceType: "seed",
            referenceId: `seed:${user.id}`,
            transactionKey: `seed:initial-credit:${user.id}`,
            description:
              "Initial simulated PlayGame wallet balance",
            status: "completed",
          });
      }
    });
  }
}