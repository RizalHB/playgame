import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/password";

import { db } from "../database";
import { users } from "../schema";

const SEED_PASSWORD = "PlayGame123!";

export const DEFAULT_ADMIN = {
  username: "Administrator",
  email: "admin@playgame.local",
};

export async function seedAdmin(
  adminRoleId: string,
) {
  const passwordHash =
    await hashPassword(SEED_PASSWORD);

  const existingUser =
    await db.query.users.findFirst({
      where: eq(
        users.email,
        DEFAULT_ADMIN.email,
      ),
    });

  if (existingUser) {
    /*
     * Do not create a duplicate administrator
     * when the seed is executed again.
     */
    return existingUser;
  }

  const userId =
    crypto.randomUUID();

  await db.insert(users).values({
    id: userId,

    roleId: adminRoleId,

    username:
      DEFAULT_ADMIN.username,

    email:
      DEFAULT_ADMIN.email,

    passwordHash,

    emailVerified: true,

    twoFactorEnabled: false,

    status: "active",
  });

  const createdUser =
    await db.query.users.findFirst({
      where: eq(
        users.id,
        userId,
      ),
    });

  if (!createdUser) {
    throw new Error(
      "Failed to create seed administrator.",
    );
  }

  return createdUser;
}