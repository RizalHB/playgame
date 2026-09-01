import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import { games } from "@/lib/database/schema";

export async function getDeveloperGames(
  developerId: string,
) {
  return db.query.games.findMany({
    where: eq(
      games.developerId,
      developerId,
    ),
    orderBy: (games, { desc }) => [
      desc(games.updatedAt),
    ],
  });
}

export async function getDeveloperGame(
  developerId: string,
  gameId: string,
) {
  return db.query.games.findFirst({
    where: and(
      eq(games.id, gameId),
      eq(
        games.developerId,
        developerId,
      ),
    ),
    with: {
      media: {
        orderBy: (media, { asc }) => [
          asc(media.displayOrder),
        ],
      },
    },
  });
}