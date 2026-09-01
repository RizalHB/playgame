"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getCurrentDeveloper,
} from "@/lib/auth/current-developer";

import {
  GameLifecycleError,
  submitGameForReview,
  withdrawGameSubmission,
} from "@/lib/services/games/game-lifecycle";

export type GameLifecycleState = {
  success?: boolean;
  error?: string;
};

export async function submitDeveloperGameForReview(
  gameId: string,
): Promise<GameLifecycleState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  try {
    await submitGameForReview(
      gameId,
      developer.id,
    );

    revalidatePath("/developer");
    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof GameLifecycleError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error(
      "submitDeveloperGameForReview:",
      error,
    );

    return {
      success: false,
      error:
        "Something went wrong while submitting the game for review.",
    };
  }
}

export async function withdrawDeveloperGameSubmission(
  gameId: string,
): Promise<GameLifecycleState> {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  try {
    await withdrawGameSubmission(
      gameId,
      developer.id,
    );

    revalidatePath("/developer");
    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof GameLifecycleError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error(
      "withdrawDeveloperGameSubmission:",
      error,
    );

    return {
      success: false,
      error:
        "Something went wrong while withdrawing the submission.",
    };
  }
}