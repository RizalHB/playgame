import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  gameMedia,
  games,
} from "@/lib/database/schema";

export const GAME_MEDIA_TYPE = {
  COVER: "cover",
  HEADER: "header",
  BANNER: "banner",
  SCREENSHOT: "screenshot",
  TRAILER: "trailer",
} as const;

export type GameMediaType =
  (typeof GAME_MEDIA_TYPE)[keyof typeof GAME_MEDIA_TYPE];

export class GameMediaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameMediaError";
  }
}

/**
 * Verify that the game exists and belongs to
 * the developer performing the operation.
 */
async function getDeveloperOwnedGame(
  gameId: string,
  developerId: string,
) {
  const game =
    await db.query.games.findFirst({
      where: and(
        eq(games.id, gameId),
        eq(
          games.developerId,
          developerId,
        ),
      ),
    });

  if (!game) {
    throw new GameMediaError(
      "Game not found or you do not have permission to manage it.",
    );
  }

  return game;
}

/**
 * Get all media belonging to a developer-owned game.
 */
export async function getDeveloperGameMedia(
  gameId: string,
  developerId: string,
) {
  await getDeveloperOwnedGame(
    gameId,
    developerId,
  );

  return db.query.gameMedia.findMany({
    where: eq(
      gameMedia.gameId,
      gameId,
    ),
    orderBy: (media, { asc }) => [
      asc(media.displayOrder),
      asc(media.createdAt),
    ],
  });
}

/**
 * Add media to a developer-owned game.
 *
 * The actual file storage/upload layer will be
 * connected later. This service currently accepts
 * an already-created media URL.
 */
export async function addGameMedia(
  gameId: string,
  developerId: string,
  input: {
    type: GameMediaType;
    mediaType?: string;
    title?: string | null;
    altText?: string | null;
    url: string;
    thumbnailUrl?: string | null;
    isPrimary?: boolean;
    displayOrder?: number;
  },
) {
  await getDeveloperOwnedGame(
    gameId,
    developerId,
  );

  const url = input.url.trim();

  if (!url) {
    throw new GameMediaError(
      "Media URL is required.",
    );
  }

  if (input.displayOrder !== undefined) {
    if (
      !Number.isInteger(
        input.displayOrder,
      ) ||
      input.displayOrder < 1
    ) {
      throw new GameMediaError(
        "Display order must be a positive integer.",
      );
    }
  }

  const mediaId =
    crypto.randomUUID();

  await db.insert(gameMedia).values({
    id: mediaId,
    gameId,
    type: input.type,
    mediaType:
      input.mediaType ?? "image",
    title:
      input.title?.trim() || null,
    altText:
      input.altText?.trim() || null,
    url,
    thumbnailUrl:
      input.thumbnailUrl?.trim() ||
      null,
    isPrimary:
      input.isPrimary ?? false,
    displayOrder:
      input.displayOrder ?? 1,
  });

  const createdMedia =
    await db.query.gameMedia.findFirst({
      where: eq(
        gameMedia.id,
        mediaId,
      ),
    });

  if (!createdMedia) {
    throw new GameMediaError(
      "Failed to create game media.",
    );
  }

  return createdMedia;
}

/**
 * Delete media belonging to a developer-owned
 * game.
 */
export async function deleteGameMedia(
  gameMediaId: string,
  developerId: string,
) {
  const media =
    await db.query.gameMedia.findFirst({
      where: eq(
        gameMedia.id,
        gameMediaId,
      ),
    });

  if (!media) {
    throw new GameMediaError(
      "Game media not found.",
    );
  }

  await getDeveloperOwnedGame(
    media.gameId,
    developerId,
  );

  await db
    .delete(gameMedia)
    .where(
      and(
        eq(
          gameMedia.id,
          gameMediaId,
        ),
        eq(
          gameMedia.gameId,
          media.gameId,
        ),
      ),
    );
}

/**
 * Change media ordering.
 */
export async function updateGameMediaOrder(
  gameMediaId: string,
  developerId: string,
  displayOrder: number,
) {
  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 1
  ) {
    throw new GameMediaError(
      "Display order must be a positive integer.",
    );
  }

  const media =
    await db.query.gameMedia.findFirst({
      where: eq(
        gameMedia.id,
        gameMediaId,
      ),
    });

  if (!media) {
    throw new GameMediaError(
      "Game media not found.",
    );
  }

  await getDeveloperOwnedGame(
    media.gameId,
    developerId,
  );

  await db
    .update(gameMedia)
    .set({
      displayOrder,
      updatedAt: new Date(),
    })
    .where(
      eq(
        gameMedia.id,
        gameMediaId,
      ),
    );
}