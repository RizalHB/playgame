import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import { libraries } from "@/lib/database/schema";

export async function getGameOwnership(
  userId: string,
  gameId: string
) {
  const library =
    await db.query.libraries.findFirst({
      where: and(
        eq(libraries.userId, userId),
        eq(libraries.gameId, gameId)
      ),
    });

  if (!library) {
    return {
      owned: false,

      purchasedAt: null,

      playTimeMinutes: 0,

      installed: false,

      favorite: false,

      hidden: false,
    };
  }

  return {
    owned: true,

    purchasedAt: library.purchasedAt,

    playTimeMinutes:
      library.playTimeMinutes,

    installed: false,

    favorite: false,

    hidden: false,
  };
}