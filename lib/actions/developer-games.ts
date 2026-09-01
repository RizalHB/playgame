"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentDeveloper } from "@/lib/auth/current-developer";
import { db } from "@/lib/database/database";
import {
  GAME_STATUS,
  games,
} from "@/lib/database/schema";

import {
  GameLifecycleError,
  scheduleGameRelease as scheduleGameReleaseService,
  submitGameForReview as submitGameForReviewService,
  withdrawGameSubmission as withdrawGameSubmissionService,
} from "@/lib/services/games/game-lifecycle";

/*
 * -------------------------
 * Types
 * -------------------------
 */

export type CreateGameState = {
  error?: string;
};

export type UpdateGameState = {
  error?: string;
  success?: string;
};

export type GameLifecycleState = {
  error?: string;
  success?: string;
};

/*
 * -------------------------
 * Shared validation helpers
 * -------------------------
 */

function parseGameFields(formData: FormData) {
  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const shortDescription = String(
    formData.get("shortDescription") ?? "",
  ).trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const basePriceRaw = String(
    formData.get("basePrice") ?? "",
  ).trim();

  const releaseDateRaw = String(
    formData.get("releaseDate") ?? "",
  ).trim();

  const isPreOrder =
    formData.get("isPreOrder") === "on";

  return {
    title,
    shortDescription,
    description,
    basePriceRaw,
    releaseDateRaw,
    isPreOrder,
  };
}

function validateGameFields(
  fields: ReturnType<typeof parseGameFields>,
) {
  const {
    title,
    shortDescription,
    description,
    basePriceRaw,
    releaseDateRaw,
  } = fields;

  if (!title) {
    return {
      error: "Game title is required.",
    };
  }

  if (
    title.length < 2 ||
    title.length > 120
  ) {
    return {
      error:
        "Game title must be between 2 and 120 characters.",
    };
  }

  if (shortDescription.length > 300) {
    return {
      error:
        "Short description cannot exceed 300 characters.",
    };
  }

  if (description.length > 10000) {
    return {
      error:
        "Description cannot exceed 10,000 characters.",
    };
  }

  if (!basePriceRaw) {
    return {
      error: "Game price is required.",
    };
  }

  if (!/^\d+$/.test(basePriceRaw)) {
    return {
      error:
        "Game price must be a whole number in IDR.",
    };
  }

  const basePrice = Number(basePriceRaw);

  if (!Number.isSafeInteger(basePrice)) {
    return {
      error: "Game price is too large.",
    };
  }

  if (basePrice < 0) {
    return {
      error:
        "Game price cannot be negative.",
    };
  }

  let releaseDate: Date | null = null;

  if (releaseDateRaw) {
    const parsedReleaseDate = new Date(
      `${releaseDateRaw}T00:00:00.000Z`,
    );

    if (
      Number.isNaN(
        parsedReleaseDate.getTime(),
      )
    ) {
      return {
        error: "Release date is invalid.",
      };
    }

    releaseDate = parsedReleaseDate;
  }

  return {
    value: {
      title,
      shortDescription,
      description,
      basePrice,
      releaseDate,
      isPreOrder:
        fields.isPreOrder,
    },
  };
}

/*
 * -------------------------
 * Shared ownership helper
 * -------------------------
 */

async function getOwnedGame(
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
  });
}

/*
 * -------------------------
 * Create Game
 * -------------------------
 */

export async function createDeveloperGame(
  _previousState: CreateGameState,
  formData: FormData,
): Promise<CreateGameState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const fields =
    parseGameFields(formData);

  const validation =
    validateGameFields(fields);

  if ("error" in validation) {
    return {
      error: validation.error,
    };
  }

  const {
    title,
    shortDescription,
    description,
    basePrice,
    releaseDate,
    isPreOrder,
  } = validation.value;

  /*
   * New games ALWAYS start as DRAFT.
   *
   * Lifecycle source of truth:
   * games.status
   */
  await db.insert(games).values({
    id: crypto.randomUUID(),

    /*
     * SECURITY:
     *
     * Never accept developerId from the browser.
     * Always use the authenticated developer.
     */
    developerId: developer.id,

    title,

    shortDescription:
      shortDescription || null,

    description:
      description || null,

    basePrice,

    releaseDate,

    status: GAME_STATUS.DRAFT,

    /*
     * Compatibility field.
     *
     * status is the lifecycle source of truth.
     */
    isPublished: false,

    isPreOrder,

    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/developer");

  redirect("/developer");
}

/*
 * -------------------------
 * Update Game Metadata
 * -------------------------
 */

export async function updateDeveloperGame(
  _previousState: UpdateGameState,
  formData: FormData,
): Promise<UpdateGameState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = String(
    formData.get("gameId") ?? "",
  ).trim();

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  /*
   * Ownership boundary.
   *
   * The browser may provide gameId,
   * but never developerId.
   */
  const existingGame =
    await getOwnedGame(
      developer.id,
      gameId,
    );

  if (!existingGame) {
    return {
      error:
        "Game not found or you do not have permission to edit it.",
    };
  }

  const fields =
    parseGameFields(formData);

  const validation =
    validateGameFields(fields);

  if ("error" in validation) {
    return {
      error: validation.error,
    };
  }

  const {
    title,
    shortDescription,
    description,
    basePrice,
    releaseDate,
    isPreOrder,
  } = validation.value;

  /*
   * Metadata editing does NOT change lifecycle
   * status.
   *
   * For example:
   *
   * DRAFT -> DRAFT
   * PENDING_REVIEW -> PENDING_REVIEW
   * APPROVED -> APPROVED
   * SCHEDULED -> SCHEDULED
   */
  await db
    .update(games)
    .set({
      title,

      shortDescription:
        shortDescription || null,

      description:
        description || null,

      basePrice,

      releaseDate,

      isPreOrder,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),
        eq(
          games.developerId,
          developer.id,
        ),
      ),
    );

  revalidatePath("/developer");

  revalidatePath(
    `/developer/games/${gameId}`,
  );

  return {
    success:
      "Game metadata updated successfully.",
  };
}

/*
 * =========================================================
 * GAME LIFECYCLE ACTIONS
 * =========================================================
 *
 * These actions are intentionally thin.
 *
 * Server Action
 *      ↓
 * authenticate developer
 *      ↓
 * validate FormData
 *      ↓
 * lifecycle service
 *      ↓
 * database
 *
 * The lifecycle service owns transition rules.
 */

/*
 * -------------------------
 * Submit Game For Review
 * -------------------------
 *
 * DRAFT
 *   ↓
 * PENDING_REVIEW
 *
 * REJECTED
 *   ↓
 * PENDING_REVIEW
 *
 * NOTE:
 * The current UI only exposes submission from DRAFT.
 * The service also supports REJECTED → PENDING_REVIEW.
 */

export async function submitGameForReview(
  _previousState: GameLifecycleState,
  formData: FormData,
): Promise<GameLifecycleState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = String(
    formData.get("gameId") ?? "",
  ).trim();

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  try {
    await submitGameForReviewService(
      gameId,
      developer.id,
    );

    revalidatePath("/developer");

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success:
        "Game submitted for review.",
    };
  } catch (error) {
    if (
      error instanceof GameLifecycleError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "submitGameForReview failed:",
      error,
    );

    return {
      error:
        "Unable to submit the game for review. Please try again.",
    };
  }
}

/*
 * -------------------------
 * Withdraw Game From Review
 * -------------------------
 *
 * PENDING_REVIEW
 *   ↓
 * DRAFT
 */

export async function withdrawGameFromReview(
  _previousState: GameLifecycleState,
  formData: FormData,
): Promise<GameLifecycleState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = String(
    formData.get("gameId") ?? "",
  ).trim();

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  try {
    await withdrawGameSubmissionService(
      gameId,
      developer.id,
    );

    revalidatePath("/developer");

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success:
        "Game has been returned to draft.",
    };
  } catch (error) {
    if (
      error instanceof GameLifecycleError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "withdrawGameFromReview failed:",
      error,
    );

    return {
      error:
        "Unable to withdraw the game submission. Please try again.",
    };
  }
}

/*
 * -------------------------
 * Schedule Game Release
 * -------------------------
 *
 * APPROVED
 *   ↓
 * SCHEDULED
 */

export async function scheduleGameRelease(
  _previousState: GameLifecycleState,
  formData: FormData,
): Promise<GameLifecycleState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const gameId = String(
    formData.get("gameId") ?? "",
  ).trim();

  if (!gameId) {
    return {
      error: "Game ID is missing.",
    };
  }

  try {
    await scheduleGameReleaseService(
      gameId,
      developer.id,
    );

    revalidatePath("/developer");

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success:
        "Game release has been scheduled.",
    };
  } catch (error) {
    if (
      error instanceof GameLifecycleError
    ) {
      return {
        error: error.message,
      };
    }

    console.error(
      "scheduleGameRelease failed:",
      error,
    );

    return {
      error:
        "Unable to schedule the game release. Please try again.",
    };
  }
}