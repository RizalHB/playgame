import {
  and,
  asc,
  eq,
  or,
} from "drizzle-orm";
import { db } from "@/lib/database/database";
import { gameInstallations } from "@/lib/database/schema";
import { ensureInstallationRecord } from "@/lib/services/installations/installation-service";

export async function enqueueInstallation(
  userId: string,
  gameId: string
) {
  await ensureInstallationRecord(userId, gameId);

  await db
    .update(gameInstallations)
    .set({
      status: "queued",

      currentOperation: "Queued",

      downloadProgress: 0,

      downloadSpeedMbps: 0,

      remainingSeconds: 0,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function startDownload(
  userId: string,
  gameId: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "downloading",

      currentOperation: "Downloading",

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function updateDownloadProgress(
  userId: string,
  gameId: string,
  progress: number,
  speedMbps: number,
  remainingSeconds: number
) {
  await db
    .update(gameInstallations)
    .set({
      downloadProgress: progress,

      downloadSpeedMbps: speedMbps,

      remainingSeconds,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function startInstalling(
  userId: string,
  gameId: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "installing",

      currentOperation: "Installing",

      downloadProgress: 90,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function finishInstallation(
  userId: string,
  gameId: string,
  version: string,
  installPath: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "installed",

      currentOperation: "Installed",

      downloadProgress: 100,

      downloadSpeedMbps: 0,

      remainingSeconds: 0,

      installedVersion: version,

      installPath,

      installedAt: new Date(),

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function cancelInstallation(
  userId: string,
  gameId: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "not_installed",

      currentOperation: "Idle",

      downloadProgress: 0,

      downloadSpeedMbps: 0,

      remainingSeconds: 0,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}
export async function getActiveInstallation(
  userId: string
) {
  return db.query.gameInstallations.findFirst({
    where: and(
      eq(gameInstallations.userId, userId),
      or(
        eq(gameInstallations.status, "downloading"),
        eq(gameInstallations.status, "installing"),
        eq(gameInstallations.status, "updating")
      )
    ),
  });
}

export async function getQueuedInstallations(
  userId: string
) {
  return db.query.gameInstallations.findMany({
    where: and(
      eq(gameInstallations.userId, userId),
      eq(gameInstallations.status, "queued")
    ),

    orderBy: [
      asc(gameInstallations.createdAt),
    ],
  });
}
export async function pauseDownload(
  userId: string,
  gameId: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "paused",
      currentOperation: "Paused",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}

export async function resumeDownload(
  userId: string,
  gameId: string
) {
  await db
    .update(gameInstallations)
    .set({
      status: "downloading",
      currentOperation: "Downloading",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}