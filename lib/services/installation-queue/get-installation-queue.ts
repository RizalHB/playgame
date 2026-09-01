import {
  and,
  asc,
  eq,
  inArray,
} from "drizzle-orm";

import { db } from "@/lib/database/database";

import { gameInstallations } from "@/lib/database/schema";

export async function getInstallationQueue(
  userId: string
) {
  return db.query.gameInstallations.findMany({
    where: and(
      eq(
        gameInstallations.userId,
        userId
      ),

      inArray(
        gameInstallations.status,
        [
          "queued",
          "downloading",
          "installing",
          "updating",
        ]
      )
    ),

    with: {
      game: {
        with: {
          developer: true,
          media: true,
        },
      },
    },

    orderBy: [
      asc(
        gameInstallations.createdAt
      ),
    ],
  });
}