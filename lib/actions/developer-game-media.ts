"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getCurrentDeveloper,
} from "@/lib/auth/current-developer";

import {
  GameMediaError,
  GAME_MEDIA_TYPE,
  addGameMedia,
  deleteGameMedia,
  updateGameMediaOrder,
} from "@/lib/services/games/game-media";

export type GameMediaActionState = {
  error?: string;
  success?: string;
};

function getString(
  value: FormDataEntryValue | null,
) {
  return String(value ?? "").trim();
}

/**
 * Developer adds URL-based game media.
 */
export async function addDeveloperGameMedia(
  _previousState: GameMediaActionState,
  formData: FormData,
): Promise<GameMediaActionState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = getString(
    formData.get("gameId"),
  );

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  const type = getString(
    formData.get("type"),
  );

  const mediaType = getString(
    formData.get("mediaType"),
  ) || "image";

  const title = getString(
    formData.get("title"),
  );

  const altText = getString(
    formData.get("altText"),
  );

  const url = getString(
    formData.get("url"),
  );

  const thumbnailUrl = getString(
    formData.get("thumbnailUrl"),
  );

  const displayOrderValue =
    getString(
      formData.get("displayOrder"),
    );

  const isPrimary =
    formData.get("isPrimary") ===
    "on";

  if (
    !Object.values(
      GAME_MEDIA_TYPE,
    ).includes(
      type as typeof GAME_MEDIA_TYPE[keyof typeof GAME_MEDIA_TYPE],
    )
  ) {
    return {
      error: "Invalid media type.",
    };
  }

  if (!url) {
    return {
      error: "Media URL is required.",
    };
  }

  const displayOrder =
    displayOrderValue
      ? Number(displayOrderValue)
      : 1;

  if (
    !Number.isInteger(
      displayOrder,
    ) ||
    displayOrder < 1
  ) {
    return {
      error:
        "Display order must be a positive integer.",
    };
  }

  try {
    await addGameMedia(
      gameId,
      developer.id,
      {
        type: type as typeof GAME_MEDIA_TYPE[keyof typeof GAME_MEDIA_TYPE],
        mediaType,
        title: title || null,
        altText: altText || null,
        url,
        thumbnailUrl:
          thumbnailUrl || null,
        isPrimary,
        displayOrder,
      },
    );

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    revalidatePath(
      `/game/${gameId}`,
    );

    return {
      success:
        "Game media has been added.",
    };
  } catch (error) {
    if (
      error instanceof GameMediaError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "addDeveloperGameMedia failed:",
      error,
    );

    return {
      error:
        "Unable to add game media. Please try again.",
    };
  }
}

/**
 * Developer deletes game media.
 */
export async function deleteDeveloperGameMedia(
  _previousState: GameMediaActionState,
  formData: FormData,
): Promise<GameMediaActionState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = getString(
    formData.get("gameId"),
  );

  const mediaId = getString(
    formData.get("mediaId"),
  );

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  if (!mediaId) {
    return {
      error: "Media ID is missing.",
    };
  }

  try {
    await deleteGameMedia(
      mediaId,
      developer.id,
    );

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    revalidatePath(
      `/game/${gameId}`,
    );

    return {
      success:
        "Game media has been deleted.",
    };
  } catch (error) {
    if (
      error instanceof GameMediaError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "deleteDeveloperGameMedia failed:",
      error,
    );

    return {
      error:
        "Unable to delete game media. Please try again.",
    };
  }
}

/**
 * Developer changes media display order.
 */
export async function updateDeveloperGameMediaOrder(
  _previousState: GameMediaActionState,
  formData: FormData,
): Promise<GameMediaActionState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = getString(
    formData.get("gameId"),
  );

  const mediaId = getString(
    formData.get("mediaId"),
  );

  const displayOrderValue =
    getString(
      formData.get("displayOrder"),
    );

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  if (!mediaId) {
    return {
      error: "Media ID is missing.",
    };
  }

  const displayOrder =
    Number(displayOrderValue);

  if (
    !Number.isInteger(
      displayOrder,
    ) ||
    displayOrder < 1
  ) {
    return {
      error:
        "Display order must be a positive integer.",
    };
  }

  try {
    await updateGameMediaOrder(
      mediaId,
      developer.id,
      displayOrder,
    );

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    revalidatePath(
      `/game/${gameId}`,
    );

    return {
      success:
        "Media order has been updated.",
    };
  } catch (error) {
    if (
      error instanceof GameMediaError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "updateDeveloperGameMediaOrder failed:",
      error,
    );

    return {
      error:
        "Unable to update media order. Please try again.",
    };
  }
}