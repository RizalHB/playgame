import { eq, ne } from "drizzle-orm";

import { db } from "../database";
import {
  gameMedia,
  games,
} from "../schema";

export async function getRelatedGames(
  gameId: string
) {
  return db
    .select({
      id: games.id,
      title: games.title,
      basePrice: games.basePrice,
      headerUrl: gameMedia.url,
    })
    .from(games)
    .innerJoin(
      gameMedia,
      eq(gameMedia.gameId, games.id)
    )
    .where(
      eq(gameMedia.type, "header")
    )
    .limit(4)
    .then((rows) =>
      rows.filter(
        (game) => game.id !== gameId
      )
    );
}