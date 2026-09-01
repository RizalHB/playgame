import { count, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  games,
  roles,
  users,
} from "@/lib/database/schema";

import { USER_ROLES } from "@/lib/constants/roles";

export async function getAdminDashboardStats() {
  const [
    gamersResult,
    developersResult,
    gamesResult,
    pendingReviewsResult,
  ] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(users)
      .innerJoin(
        roles,
        eq(users.roleId, roles.id),
      )
      .where(
        eq(
          roles.name,
          USER_ROLES.GAMER,
        ),
      ),

    db
      .select({
        count: count(),
      })
      .from(users)
      .innerJoin(
        roles,
        eq(users.roleId, roles.id),
      )
      .where(
        eq(
          roles.name,
          USER_ROLES.DEVELOPER,
        ),
      ),

    db
      .select({
        count: count(),
      })
      .from(games),

    db
      .select({
        count: count(),
      })
      .from(games)
      .where(
        eq(
          games.status,
          "pending_review",
        ),
      ),
  ]);

  return {
    gamers: gamersResult[0]?.count ?? 0,
    developers:
      developersResult[0]?.count ?? 0,
    games: gamesResult[0]?.count ?? 0,
    pendingReviews:
      pendingReviewsResult[0]?.count ?? 0,
  };
}