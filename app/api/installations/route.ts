import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/lib/auth/current-user";

import { getInstallationQueue } from "@/lib/services/installation-queue/get-installation-queue";

import { advanceInstallation } from "@/lib/services/installation-queue/installation-tick";

export async function GET() {
  const userId =
    await getCurrentUserId();

  // Read current queue
  const queue =
    await getInstallationQueue(userId);

  // Advance every active installation one tick
  for (const installation of queue) {
    await advanceInstallation(
      userId,
      installation.gameId
    );
  }

  // Read updated queue
  const updatedQueue =
    await getInstallationQueue(userId);

  return NextResponse.json(
    updatedQueue
  );
}