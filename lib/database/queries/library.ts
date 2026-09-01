import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  developerProfiles,
  gameMedia,
  games,
  libraries,
} from "@/lib/database/schema";
export async function getLibrary(userId: string) {
  const rows = await db
    .select({
      libraryId: libraries.id,

      gameId: games.id,

      title: games.title,

      developer:
        developerProfiles.studioName,

      headerUrl: gameMedia.url,

      purchasedAt:
        libraries.purchasedAt,

      playTimeMinutes:
        libraries.playTimeMinutes,
    })
    .from(libraries)

    .innerJoin(
      games,
      eq(libraries.gameId, games.id)
    )

    .innerJoin(
      developerProfiles,
      eq(
        games.developerId,
        developerProfiles.id
      )
    )

    .leftJoin(
      gameMedia,
      and(
        eq(gameMedia.gameId, games.id),
        eq(gameMedia.isPrimary, true)
      )
    )

    .where(eq(libraries.userId, userId))

    .orderBy(desc(libraries.purchasedAt));

  return rows.map((row) => ({
    id: row.libraryId,

    gameId: row.gameId,

    title: row.title,

    developer:
      row.developer,

    headerUrl:
      row.headerUrl,

    purchasedAt:
      row.purchasedAt,

    playTimeMinutes:
      row.playTimeMinutes,
  }));
}