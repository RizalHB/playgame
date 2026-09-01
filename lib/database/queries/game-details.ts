import { eq } from "drizzle-orm";
import { db } from "../database";
import {
  developerProfiles,
  gameMedia,
  games,
  systemRequirements,
} from "../schema";
export async function getGameDetails(gameId: string) {
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (!game) {
    return null;
  }
  const developer = await db.query.developerProfiles.findFirst({
    where: eq(developerProfiles.id, game.developerId),
  });
  const media = await db.query.gameMedia.findMany({
    where: eq(gameMedia.gameId, game.id),
    orderBy: (media, { asc }) => [
      asc(media.displayOrder),
    ],
  });
  const requirements =
    await db.query.systemRequirements.findFirst({
      where: eq(systemRequirements.gameId, game.id),
    });
  return {
    game,
    developer,
    media,
    requirements,
  };
}