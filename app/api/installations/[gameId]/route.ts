import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { gameSessions } from "@/lib/database/schema";
import { isNull } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth/current-user";

import { db } from "@/lib/database/database";
import { gameInstallations } from "@/lib/database/schema";

import { advanceInstallation } from "@/lib/services/installation-queue/installation-tick";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      gameId: string;
    }>;
  }
) {
  const userId =
    await getCurrentUserId();

  const { gameId } =
    await params;

  // Advance one installation tick
  await advanceInstallation(
    userId,
    gameId
  );

  const installation =
    await db.query.gameInstallations.findFirst({
      where: and(
        eq(
          gameInstallations.userId,
          userId
        ),
        eq(
          gameInstallations.gameId,
          gameId
        )
      ),
    });
    const session =
  await db.query.gameSessions.findFirst({
    where: and(
      eq(gameSessions.userId, userId),
      eq(gameSessions.gameId, gameId),
      isNull(gameSessions.endedAt)
    ),
  });

  return NextResponse.json({
  ...installation,

  progress:
    installation?.downloadProgress ?? 0,

  playing:
    !!session,
});
}