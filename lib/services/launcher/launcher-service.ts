import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/database/database";

import { gameSessions } from "@/lib/database/schema";

export async function startGameSession(
  userId: string,
  gameId: string
) {
  await db.insert(gameSessions).values({
    userId,
    gameId,

    status: "playing",

    playTimeMinutes: 0,

    startedAt: new Date(),

    endedAt: null,
  });
}

export async function getActiveSession(
  userId: string,
  gameId: string
) {
  return db.query.gameSessions.findFirst({
    where: and(
      eq(gameSessions.userId, userId),
      eq(gameSessions.gameId, gameId),
      isNull(gameSessions.endedAt)
    ),
  });
}

export async function stopGameSession(
  userId: string,
  gameId: string
) {
  const session =
    await getActiveSession(
      userId,
      gameId
    );

  if (!session) {
    return;
  }

  const started =
    session.startedAt.getTime();

  const ended =
    Date.now();

  const minutes =
    Math.max(
      1,
      Math.floor(
        (ended - started) /
          60000
      )
    );

  await db
    .update(gameSessions)
    .set({
      status: "closed",

      endedAt: new Date(),

      playTimeMinutes:
        minutes,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        gameSessions.id,
        session.id
      )
    );
}