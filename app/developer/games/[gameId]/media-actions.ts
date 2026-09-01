"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getCurrentDeveloper } from "@/lib/auth/current-developer";
import { db } from "@/lib/database/database";
import { gameMedia, games, GAME_STATUS } from "@/lib/database/schema";

const MEDIA_TYPES = [
  "header",
  "capsule",
  "banner",
  "library",
  "screenshot",
  "trailer",
] as const;

type MediaType = (typeof MEDIA_TYPES)[number];

const MEDIA_KINDS = ["image", "video"] as const;

type MediaKind = (typeof MEDIA_KINDS)[number];

interface MediaActionResult {
  success?: string;
  error?: string;
}

function isValidMediaType(
  value: string,
): value is MediaType {
  return MEDIA_TYPES.includes(
    value as MediaType,
  );
}

function isValidMediaKind(
  value: string,
): value is MediaKind {
  return MEDIA_KINDS.includes(
    value as MediaKind,
  );
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

async function getOwnedGame(
  developerId: string,
  gameId: string,
) {
  return db.query.games.findFirst({
    where: and(
      eq(games.id, gameId),
      eq(games.developerId, developerId),
    ),
  });
}

export async function addGameMedia(
  gameId: string,
  input: {
    type: string;
    mediaType?: string;
    title?: string;
    altText?: string;
    url: string;
    thumbnailUrl?: string;
    isPrimary?: boolean;
    displayOrder?: number;
  },
): Promise<MediaActionResult> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    return {
      error: "Developer authentication required.",
    };
  }

  const game = await getOwnedGame(
    developer.id,
    gameId,
  );
  
  if (!game) {
    return {
      error: "Game not found.",
    };
  }
  if (
    game.status !== GAME_STATUS.DRAFT &&
    game.status !== GAME_STATUS.REJECTED
    ) {
    return {
        error:
        "Media cannot be changed while the game is under review or has been approved.",
    };
    }
  const type = input.type.trim();
  const mediaType =
    input.mediaType?.trim() || "image";
  const title =
    input.title?.trim() || null;
  const altText =
    input.altText?.trim() || null;
  const url = input.url.trim();
  const thumbnailUrl =
    input.thumbnailUrl?.trim() || null;

  if (!isValidMediaType(type)) {
    return {
      error: "Invalid media type.",
    };
  }

  if (!isValidMediaKind(mediaType)) {
    return {
      error: "Invalid media kind.",
    };
  }

  if (!url || !isValidUrl(url)) {
    return {
      error: "A valid media URL is required.",
    };
  }

  if (
    thumbnailUrl &&
    !isValidUrl(thumbnailUrl)
  ) {
    return {
      error: "Thumbnail URL is invalid.",
    };
  }

  if (
    input.displayOrder !== undefined &&
    (!Number.isInteger(input.displayOrder) ||
      input.displayOrder < 1)
  ) {
    return {
      error:
        "Display order must be a positive integer.",
    };
  }

  const existingPrimary =
    input.isPrimary === true
      ? await db.query.gameMedia.findFirst({
          where: and(
            eq(gameMedia.gameId, gameId),
            eq(gameMedia.type, type),
            eq(gameMedia.isPrimary, true),
          ),
        })
      : null;

  if (existingPrimary) {
    await db
      .update(gameMedia)
      .set({
        isPrimary: false,
        updatedAt: new Date(),
      })
      .where(
        eq(
          gameMedia.id,
          existingPrimary.id,
        ),
      );
  }

  await db.insert(gameMedia).values({
    id: crypto.randomUUID(),
    gameId,
    type,
    mediaType,
    title,
    altText,
    url,
    thumbnailUrl,
    isPrimary: input.isPrimary ?? false,
    displayOrder:
      input.displayOrder ?? 1,
  });

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  revalidatePath("/");

  return {
    success: "Media added successfully.",
  };
}

export async function updateGameMedia(
  gameId: string,
  mediaId: string,
  input: {
    type: string;
    mediaType?: string;
    title?: string;
    altText?: string;
    url: string;
    thumbnailUrl?: string;
    isPrimary?: boolean;
    displayOrder?: number;
  },
): Promise<MediaActionResult> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    return {
      error: "Developer authentication required.",
    };
  }

  const game = await getOwnedGame(
    developer.id,
    gameId,
  );

  if (!game) {
    return {
      error: "Game not found.",
    };
  }
  if (
    game.status !== GAME_STATUS.DRAFT &&
    game.status !== GAME_STATUS.REJECTED
    ) {
    return {
        error:
        "Media cannot be changed while the game is under review or has been approved.",
    };
    }
  const media =
    await db.query.gameMedia.findFirst({
      where: and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    });

  if (!media) {
    return {
      error: "Media not found.",
    };
  }

  const type = input.type.trim();
  const mediaType =
    input.mediaType?.trim() || "image";
  const title =
    input.title?.trim() || null;
  const altText =
    input.altText?.trim() || null;
  const url = input.url.trim();
  const thumbnailUrl =
    input.thumbnailUrl?.trim() || null;

  if (!isValidMediaType(type)) {
    return {
      error: "Invalid media type.",
    };
  }

  if (!isValidMediaKind(mediaType)) {
    return {
      error: "Invalid media kind.",
    };
  }

  if (!url || !isValidUrl(url)) {
    return {
      error: "A valid media URL is required.",
    };
  }

  if (
    thumbnailUrl &&
    !isValidUrl(thumbnailUrl)
  ) {
    return {
      error: "Thumbnail URL is invalid.",
    };
  }

  if (
    input.displayOrder !== undefined &&
    (!Number.isInteger(input.displayOrder) ||
      input.displayOrder < 1)
  ) {
    return {
      error:
        "Display order must be a positive integer.",
    };
  }

  if (input.isPrimary === true) {
    await db
      .update(gameMedia)
      .set({
        isPrimary: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(gameMedia.gameId, gameId),
          eq(gameMedia.type, type),
        ),
      );
  }

  await db
    .update(gameMedia)
    .set({
      type,
      mediaType,
      title,
      altText,
      url,
      thumbnailUrl,
      isPrimary: input.isPrimary ?? false,
      displayOrder:
        input.displayOrder ?? media.displayOrder,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    );

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  revalidatePath("/");

  return {
    success: "Media updated successfully.",
  };
}

export async function deleteGameMedia(
  gameId: string,
  mediaId: string,
): Promise<MediaActionResult> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    return {
      error: "Developer authentication required.",
    };
  }

  const game = await getOwnedGame(
    developer.id,
    gameId,
  );

  if (!game) {
    return {
      error: "Game not found.",
    };
  }
  if (
    game.status !== GAME_STATUS.DRAFT &&
    game.status !== GAME_STATUS.REJECTED
    ) {
    return {
        error:
        "Media cannot be changed while the game is under review or has been approved.",
    };
    }
  const media =
    await db.query.gameMedia.findFirst({
      where: and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    });

  if (!media) {
    return {
      error: "Media not found.",
    };
  }

  await db
    .delete(gameMedia)
    .where(
      and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    );

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  revalidatePath("/");

  return {
    success: "Media deleted successfully.",
  };
}

export async function setPrimaryGameMedia(
  gameId: string,
  mediaId: string,
): Promise<MediaActionResult> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    return {
      error: "Developer authentication required.",
    };
  }

  const game = await getOwnedGame(
    developer.id,
    gameId,
  );

  if (!game) {
    return {
      error: "Game not found.",
    };
  }

  const media =
    await db.query.gameMedia.findFirst({
      where: and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    });

  if (!media) {
    return {
      error: "Media not found.",
    };
  }

  await db
    .update(gameMedia)
    .set({
      isPrimary: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameMedia.gameId, gameId),
        eq(gameMedia.type, media.type),
      ),
    );

  await db
    .update(gameMedia)
    .set({
      isPrimary: true,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    );

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  revalidatePath("/");

  return {
    success: "Primary media updated.",
  };
}

export async function updateGameMediaOrder(
  gameId: string,
  mediaId: string,
  displayOrder: number,
): Promise<MediaActionResult> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    return {
      error: "Developer authentication required.",
    };
  }

  const game = await getOwnedGame(
    developer.id,
    gameId,
  );

  if (!game) {
    return {
      error: "Game not found.",
    };
  }

  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 1
  ) {
    return {
      error:
        "Display order must be a positive integer.",
    };
  }

  const media =
    await db.query.gameMedia.findFirst({
      where: and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    });

  if (!media) {
    return {
      error: "Media not found.",
    };
  }

  await db
    .update(gameMedia)
    .set({
      displayOrder,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameMedia.id, mediaId),
        eq(gameMedia.gameId, gameId),
      ),
    );

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  return {
    success: "Media order updated.",
  };
}