import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  dlcs,
  userDlcs,
} from "@/lib/database/schema";

export async function getGameDlcs(
  gameId: string
) {
  return db.query.dlcs.findMany({
    where: eq(
      dlcs.gameId,
      gameId
    ),
    orderBy: [
      dlcs.releaseDate,
    ],
  });
}

export async function getUserDlc(
  userId: string,
  dlcId: string
) {
  return db.query.userDlcs.findFirst({
    where: and(
      eq(
        userDlcs.userId,
        userId
      ),
      eq(
        userDlcs.dlcId,
        dlcId
      )
    ),
    with: {
      dlc: true,
    },
  });
}

export async function getUserGameDlcs(
  userId: string,
  gameId: string
) {
  return db.query.userDlcs.findMany({
    where: eq(
      userDlcs.userId,
      userId
    ),
    with: {
      dlc: true,
    },
  }).then((items) =>
    items.filter(
      (item) =>
        item.dlc.gameId === gameId
    )
  );
}