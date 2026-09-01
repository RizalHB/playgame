import { eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  roles,
} from "@/lib/database/schema";

import { getCurrentSession } from "@/lib/auth/session";
import { USER_ROLES } from "@/lib/constants/roles";

export async function getCurrentAdmin() {
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

  if (
    !role ||
    role.name !==
      USER_ROLES.ADMINISTRATOR
  ) {
    return null;
  }

  return session.user;
}