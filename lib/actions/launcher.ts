"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/auth/current-user";

import {
  startGameSession,
  stopGameSession,
} from "@/lib/services/launcher/launcher-service";

export async function launchGame(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await startGameSession(
    userId,
    gameId
  );

  revalidatePath("/library");
  revalidatePath("/downloads");
  revalidatePath(`/game/${gameId}`);

  return {
    success: true,
  };
}

export async function exitGame(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await stopGameSession(
    userId,
    gameId
  );

  revalidatePath("/library");
  revalidatePath("/downloads");
  revalidatePath(`/game/${gameId}`);

  return {
    success: true,
  };
}