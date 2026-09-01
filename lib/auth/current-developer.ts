import { eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  developerProfiles,
  roles,
} from "@/lib/database/schema";
import { getCurrentSession } from "@/lib/auth/session";
import { USER_ROLES } from "@/lib/constants/roles";

export async function getCurrentDeveloper() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const role = await db.query.roles.findFirst({
    where: eq(roles.id, session.user.roleId),
  });

  if (!role || role.name !== USER_ROLES.DEVELOPER) {
    return null;
  }

  const developer = await db.query.developerProfiles.findFirst({
    where: eq(
      developerProfiles.userId,
      session.user.id,
    ),
  });

  if (!developer) {
    return null;
  }

  return developer;
}