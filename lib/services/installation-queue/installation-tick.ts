import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import { gameInstallations } from "@/lib/database/schema";

import type { InstallationStatus } from "@/lib/types/installation";

function randomBetween(
  min: number,
  max: number
) {
  return (
    Math.floor(
      Math.random() * (max - min + 1)
    ) + min
  );
}

export async function advanceInstallation(
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
    return;
  }

  switch (
    installation.status as InstallationStatus
  ) {
    case "queued": {
      await db
        .update(gameInstallations)
        .set({
          status: "downloading",

          currentOperation:
            "Downloading",

          updatedAt: new Date(),
        })
        .where(
          eq(
            gameInstallations.id,
            installation.id
          )
        );

      return;
    }

    case "downloading": {
      const increase =
        randomBetween(2, 6);

      const progress =
        Math.min(
          installation.downloadProgress +
            increase,
          100
        );

      const speed =
        randomBetween(40, 140);

      const eta =
        Math.max(
          0,
          Math.floor(
            (100 - progress) / 4
          )
        );

      if (progress >= 100) {
        await db
.update(gameInstallations)
.set({
  status: "installing",

  currentOperation:
    "Installing",

  downloadProgress: 0,

  downloadSpeedMbps: 0,

  remainingSeconds: 0,

  updatedAt: new Date(),
})
          .where(
            eq(
              gameInstallations.id,
              installation.id
            )
          );

        return;
      }

      await db
        .update(gameInstallations)
        .set({
          downloadProgress:
            progress,

          downloadSpeedMbps:
            speed,

          remainingSeconds:
            eta,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            gameInstallations.id,
            installation.id
          )
        );

      return;
    }

    case "installing": {
  const installProgress =
    installation.downloadProgress;

  const increase =
    randomBetween(10, 25);

  const progress =
    Math.min(
      installProgress + increase,
      100
    );


  if (progress >= 100) {
    await db
      .update(gameInstallations)
      .set({
        status: "installed",

        currentOperation:
          "Ready to Play",

        downloadProgress: 100,

        downloadSpeedMbps: 0,

        remainingSeconds: 0,

        installedVersion:
          "1.0.0",

        installPath:
          `C:\\PlayGame\\Games\\${gameId}`,

        installedAt:
          new Date(),

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          gameInstallations.id,
          installation.id
        )
      );

    return;
  }


  await db
    .update(gameInstallations)
    .set({
      downloadProgress:
        progress,

      currentOperation:
        `Installing ${progress}%`,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        gameInstallations.id,
        installation.id
      )
    );

  return;
}

    default:
      return;
  }
}