import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import { gameInstallations } from "@/lib/database/schema";

import type { InstallationStatus } from "@/lib/types/installation";

export async function getGameInstallation(
  userId: string,
  gameId: string
) {
  const installation =
    await db.query.gameInstallations.findFirst({
      where: and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      ),
    });

  if (!installation) {
    return {
      installed: false,

      status:
        "not_installed" as InstallationStatus,

      installPath: null,

      installedVersion: null,

      launcherVersion: null,

      installSizeBytes: 0,

      installedAt: null,

      lastPlayedAt: null,

      progress: 0,

      downloadSpeedMbps: 0,

      remainingSeconds: 0,

      currentOperation: "Idle",
    };
  }

  return {
    installed:
      installation.status === "installed",

    status:
      installation.status as InstallationStatus,

    installPath:
      installation.installPath,

    installedVersion:
      installation.installedVersion,

    launcherVersion:
      installation.launcherVersion,

    installSizeBytes:
      installation.installSizeBytes,

    installedAt:
      installation.installedAt,

    lastPlayedAt:
      installation.lastPlayedAt,

    progress:
      installation.downloadProgress,

    downloadSpeedMbps:
      installation.downloadSpeedMbps,

    remainingSeconds:
      installation.remainingSeconds,

    currentOperation:
      installation.currentOperation,
  };
}