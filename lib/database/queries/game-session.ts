import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/database/database";

import { gameSessions } from "@/lib/database/schema";

export async function getActiveGameSession(
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