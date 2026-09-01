import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  GAME_STATUS,
  games,
} from "@/lib/database/schema";

export async function getPendingReviewGames() {
  return db.query.games.findMany({
    where: eq(
      games.status,
      GAME_STATUS.PENDING_REVIEW,
    ),
    orderBy: (games, { desc }) => [
      desc(games.updatedAt),
    ],
  });
}

export async function getAdminGame(
  gameId: string,
) {
  return db.query.games.findFirst({
    where: eq(
      games.id,
      gameId,
    ),

    with: {
      media: {
        orderBy: (media, { asc }) => [
          asc(media.displayOrder),
          asc(media.createdAt),
        ],
      },

      developer: {
        with: {
          user: true,
        },
      },
    },
  });
}

export async function getAdminGameCatalog() {
  return db.query.games.findMany({
    orderBy: (games, { desc }) => [
      desc(games.updatedAt),
    ],
  });
}