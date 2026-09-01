import { eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import { roles } from "@/lib/database/schema";
import { USER_ROLES } from "@/lib/constants/roles";
import { getCurrentSession } from "@/lib/auth/session";

async function getCurrentRoleName() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const role = await db.query.roles.findFirst({
    where: eq(
      roles.id,
      session.user.roleId,
    ),
  });

  return role?.name ?? null;
}

export async function requireAdministrator() {
  const roleName =
    await getCurrentRoleName();

  if (
    roleName !==
    USER_ROLES.ADMINISTRATOR
  ) {
    throw new Error(
      "Administrator access required.",
    );
  }
}

export async function requireDeveloper() {
  const roleName =
    await getCurrentRoleName();

  if (
    roleName !== USER_ROLES.DEVELOPER
  ) {
    throw new Error(
      "Developer access required.",
    );
  }
}

export async function requireGamer() {
  const roleName =
    await getCurrentRoleName();

  if (roleName !== USER_ROLES.GAMER) {
    throw new Error(
      "Gamer access required.",
    );
  }
}