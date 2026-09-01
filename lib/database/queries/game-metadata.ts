import { eq } from "drizzle-orm";

import { db } from "../database";

import {
  categories,
  developerProfiles,
  gameCategories,
  gameGenres,
  games,
  genres,
} from "../schema";

export async function getGameMetadata(
  gameId: string
) {
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (!game) {
    return null;
  }

  const developer =
    await db.query.developerProfiles.findFirst({
      where: eq(
        developerProfiles.id,
        game.developerId
      ),
    });

  const gameGenreRows = await db
    .select({
      id: genres.id,
      name: genres.name,
    })
    .from(gameGenres)
    .innerJoin(
      genres,
      eq(gameGenres.genreId, genres.id)
    )
    .where(eq(gameGenres.gameId, gameId));

  const gameCategoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(gameCategories)
    .innerJoin(
      categories,
      eq(
        gameCategories.categoryId,
        categories.id
      )
    )
    .where(
      eq(gameCategories.gameId, gameId)
    );

  return {
    developer:
      developer?.studioName ?? "Unknown",

    publisher:
      developer?.studioName ?? "Unknown",

    releaseDate: game.releaseDate,

    genres: gameGenreRows,

    categories: gameCategoryRows,

    platforms: ["Windows"],

    languages: ["English"],
  };
}