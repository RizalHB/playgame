import { eq } from "drizzle-orm";

import { db } from "../database";
import {
  roles,
  users,
} from "../schema";

export async function getUserProfile(
  userId: string
) {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: roles.name,
      status: users.status,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(
      roles,
      eq(users.roleId, roles.id)
    )
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}