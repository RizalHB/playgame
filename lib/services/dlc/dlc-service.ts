import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  dlcs,
  userDlcs,
} from "@/lib/database/schema";

export async function ownsDlc(
  userId: string,
  dlcId: string
) {
  const ownership =
    await db.query.userDlcs.findFirst({
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
    });

  return !!ownership;
}

export async function getDlcOwnership(
  userId: string,
  dlcId: string
) {
  const ownership =
    await db.query.userDlcs.findFirst({
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
    });
    

  return {
    owned: !!ownership,
    installed:
      ownership?.installed ?? false,
    purchasedAt:
      ownership?.purchasedAt ?? null,
  };
}
export async function purchaseDlcOwnership(
  userId: string,
  dlcId: string
) {
  const existing =
    await db.query.userDlcs.findFirst({
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
    });

  if (existing) {
    return {
      success: false,
      message:
        "You already own this DLC.",
    };
  }

  await db.insert(userDlcs).values({
    userId,
    dlcId,
    installed: false,
    purchasedAt: new Date(),
  });

  return {
    success: true,
  };
}