"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/auth/current-user";

import { uninstallGame } from "@/lib/services/installations/installation-service";

import { enqueue } from "@/lib/services/installation-queue/queue-manager";

import {
  pauseDownload,
  resumeDownload,
} from "@/lib/services/installation-queue/queue-service";

export async function installGame(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await enqueue(
    userId,
    gameId
  );

  revalidatePath(`/game/${gameId}`);
  revalidatePath("/library");

  return {
    success: true,
  };
}

export async function pauseInstallation(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await pauseDownload(
    userId,
    gameId
  );

  revalidatePath(`/game/${gameId}`);

  return {
    success: true,
  };
}

export async function resumeInstallation(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await resumeDownload(
    userId,
    gameId
  );

  revalidatePath(`/game/${gameId}`);

  return {
    success: true,
  };
}

export async function removeInstalledGame(
  gameId: string
) {
  const userId =
    await getCurrentUserId();

  await uninstallGame(
    userId,
    gameId
  );

  revalidatePath(`/game/${gameId}`);
  revalidatePath("/library");

  return {
    success: true,
  };
}