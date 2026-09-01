import { eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  developerProfiles,
  roles,
  users,
} from "@/lib/database/schema";

import { USER_ROLES } from "@/lib/constants/roles";

export async function getAdminUsers() {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
      roleName: roles.name,
      studioName:
        developerProfiles.studioName,
    })
    .from(users)
    .innerJoin(
      roles,
      eq(users.roleId, roles.id),
    )
    .leftJoin(
      developerProfiles,
      eq(
        developerProfiles.userId,
        users.id,
      ),
    )
    .where(
      eq(roles.name, USER_ROLES.GAMER),
    );

  const developers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
      roleName: roles.name,
      studioName:
        developerProfiles.studioName,
    })
    .from(users)
    .innerJoin(
      roles,
      eq(users.roleId, roles.id),
    )
    .leftJoin(
      developerProfiles,
      eq(
        developerProfiles.userId,
        users.id,
      ),
    )
    .where(
      eq(
        roles.name,
        USER_ROLES.DEVELOPER,
      ),
    );

  return {
    gamers: result,
    developers,
  };
}