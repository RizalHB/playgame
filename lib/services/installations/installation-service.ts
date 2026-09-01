import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import { gameInstallations } from "@/lib/database/schema";

export async function ensureInstallationRecord(
  userId: string,
  gameId: string
) {
  const existing =
    await db.query.gameInstallations.findFirst({
      where: and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      ),
    });

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();

  await db
    .insert(gameInstallations)
    .values({
      id,

      userId,

      gameId,

      status: "not_installed",
    });

  return (
    await db.query.gameInstallations.findFirst({
      where: eq(
        gameInstallations.id,
        id
      ),
    })
  )!;
}

export async function setInstallationStatus(
  userId: string,
  gameId: string,
  status:
    | "not_installed"
    | "queued"
    | "downloading"
    | "installing"
    | "installed"
    | "updating"
) {
  await ensureInstallationRecord(
    userId,
    gameId
  );

  await db
    .update(gameInstallations)
    .set({
      status,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}
export async function markInstalled(
  userId: string,
  gameId: string,
  version: string,
  installPath: string
) {
  await ensureInstallationRecord(
    userId,
    gameId
  );

  await db
    .update(gameInstallations)
    .set({
      status: "installed",

      installPath,

      installedVersion: version,

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
export async function uninstallGame(
  userId: string,
  gameId: string
) {
  await ensureInstallationRecord(
    userId,
    gameId
  );

  await db
    .update(gameInstallations)
    .set({
      status: "not_installed",

      installPath: null,

      installedVersion: null,

      installSizeBytes: 0,

      installedAt: null,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gameInstallations.userId, userId),
        eq(gameInstallations.gameId, gameId)
      )
    );
}