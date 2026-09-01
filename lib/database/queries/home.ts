import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../database";

import {
  developerProfiles,
  gameMedia,
  games,
  GAME_STATUS,
} from "../schema";

export async function getHeroGame() {
  const result = await db
    .select({
      id: games.id,
      title: games.title,
      shortDescription:
        games.shortDescription,
      basePrice: games.basePrice,
      developer:
        developerProfiles.studioName,
      bannerUrl: gameMedia.url,
    })
    .from(games)
    .innerJoin(
      developerProfiles,
      eq(
        games.developerId,
        developerProfiles.id,
      ),
    )
    .innerJoin(
      gameMedia,
      and(
        eq(
          gameMedia.gameId,
          games.id,
        ),
        eq(
          gameMedia.type,
          "banner",
        ),
      ),
    )
    .where(
      eq(
        games.status,
        GAME_STATUS.RELEASED,
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getFeaturedGames() {
  return db
    .select({
      id: games.id,
      title: games.title,
      shortDescription:
        games.shortDescription,
      basePrice: games.basePrice,
      headerUrl: gameMedia.url,
    })
    .from(games)
    .leftJoin(
      gameMedia,
      and(
        eq(
          gameMedia.gameId,
          games.id,
        ),
        eq(
          gameMedia.type,
          "header",
        ),
      ),
    )
    .where(
      eq(
        games.status,
        GAME_STATUS.RELEASED,
      ),
    );
}

export async function getUpcomingPreorderGames() {
  return db
    .select({
      id: games.id,
      title: games.title,
      shortDescription:
        games.shortDescription,
      basePrice: games.basePrice,
      releaseDate:
        games.releaseDate,
      headerUrl: gameMedia.url,
      developer:
        developerProfiles.studioName,
    })
    .from(games)
    .innerJoin(
      developerProfiles,
      eq(
        games.developerId,
        developerProfiles.id,
      ),
    )
    .leftJoin(
      gameMedia,
      and(
        eq(
          gameMedia.gameId,
          games.id,
        ),
        eq(
          gameMedia.type,
          "header",
        ),
      ),
    )
    .where(
      and(
        eq(
          games.status,
          GAME_STATUS.SCHEDULED,
        ),
        eq(
          games.isPreOrder,
          true,
        ),
      ),
    );
}