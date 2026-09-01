import { and, eq, lte, gte } from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  games,
  discounts,
} from "@/lib/database/schema";

export interface GamePrice {
  gameId: string;
  title: string;

  unitPrice: number;

  discountPercentage: number;

  finalPrice: number;
}

export async function calculateGamePrice(
  gameId: string
): Promise<GamePrice> {
  const now = new Date();

  const game =
    await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

  if (!game) {
    throw new Error("Game not found.");
  }

  const discount =
    await db.query.discounts.findFirst({
      where: and(
        eq(discounts.gameId, gameId),

        eq(discounts.isActive, true),

        lte(discounts.startDate, now),

        gte(discounts.endDate, now)
      ),
    });

  const discountPercentage =
    discount?.percentage ?? 0;

  const finalPrice =
    game.basePrice *
    (1 - discountPercentage / 100);

  return {
    gameId,

    title: game.title,

    unitPrice: game.basePrice,

    discountPercentage,

    finalPrice,
  };
}