"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/current-admin";

import {
  approveGameSubmission,
  rejectGameSubmission,
  GameLifecycleError,
} from "@/lib/services/games/game-lifecycle";

export type AdminGameLifecycleState = {
  error?: string;
  success?: string;
};

export async function approveGame(
  _previousState: AdminGameLifecycleState,
  formData: FormData,
): Promise<AdminGameLifecycleState> {
  const admin = await getCurrentAdmin();

  if (!admin) {
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
    const result =
      await approveGameSubmission(gameId);

    if (!result) {
      return {
        error:
          "The game could not be approved.",
      };
    }

    revalidatePath("/admin");

    revalidatePath(
      `/admin/games/${gameId}`,
    );

    revalidatePath("/developer");

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success:
        "Game has been approved successfully.",
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
      "approveGame failed:",
      error,
    );

    return {
      error:
        "Unable to approve the game. Please try again.",
    };
  }
}

export async function rejectGame(
  _previousState: AdminGameLifecycleState,
  formData: FormData,
): Promise<AdminGameLifecycleState> {
  const admin = await getCurrentAdmin();

  if (!admin) {
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
    const result =
      await rejectGameSubmission(gameId);

    if (!result) {
      return {
        error:
          "The game could not be rejected.",
      };
    }

    revalidatePath("/admin");

    revalidatePath(
      `/admin/games/${gameId}`,
    );

    revalidatePath("/developer");

    revalidatePath(
      `/developer/games/${gameId}`,
    );

    return {
      success:
        "Game has been rejected.",
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
      "rejectGame failed:",
      error,
    );

    return {
      error:
        "Unable to reject the game. Please try again.",
    };
  }
}