"use server";

import { eq, and, ne } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";
import { db } from "@/lib/database/database";
import {
  users,
  userSessions,
} from "@/lib/database/schema";
import { getCurrentSession } from "@/lib/auth/session";

interface UpdateUsernameResult {
  success: boolean;
  message: string;
}

export async function updateUsername(
  username: string
): Promise<UpdateUsernameResult> {
  const session = await getCurrentSession();

  if (!session) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const normalizedUsername =
    username.trim();

  if (!normalizedUsername) {
    return {
      success: false,
      message: "Username is required.",
    };
  }

  if (
    normalizedUsername.length < 3 ||
    normalizedUsername.length > 32
  ) {
    return {
      success: false,
      message:
        "Username must be between 3 and 32 characters.",
    };
  }

  if (
    !/^[a-zA-Z0-9_]+$/.test(
      normalizedUsername
    )
  ) {
    return {
      success: false,
      message:
        "Username can only contain letters, numbers, and underscores.",
    };
  }

  const existingUser =
    await db.query.users.findFirst({
      where: and(
        eq(
          users.username,
          normalizedUsername
        ),
        ne(users.id, session.userId)
      ),
    });

  if (existingUser) {
    return {
      success: false,
      message:
        "That username is already taken.",
    };
  }

  await db
    .update(users)
    .set({
      username: normalizedUsername,
    })
    .where(
      eq(users.id, session.userId)
    );

  return {
    success: true,
    message:
      "Username updated successfully.",
  };
}
export interface ChangePasswordResult {
  success: boolean;
  message: string;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ChangePasswordResult> {
  const session =
    await getCurrentSession();

  if (!session) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  if (!currentPassword) {
    return {
      success: false,
      message:
        "Current password is required.",
    };
  }

  if (!newPassword) {
    return {
      success: false,
      message:
        "New password is required.",
    };
  }

  if (!confirmPassword) {
    return {
      success: false,
      message:
        "Please confirm your new password.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message:
        "New passwords do not match.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message:
        "New password must be at least 8 characters.",
    };
  }

  if (newPassword.length > 128) {
    return {
      success: false,
      message:
        "New password must not exceed 128 characters.",
    };
  }

  const user =
    await db.query.users.findFirst({
      where: eq(
        users.id,
        session.userId
      ),
    });

  if (!user) {
    return {
      success: false,
      message:
        "Your account could not be found.",
    };
  }

  // Verify the current password using
  // the same password verification helper
  // already used by your login flow.
  const currentPasswordValid =
    await verifyPassword(
      currentPassword,
      user.passwordHash
    );

  if (!currentPasswordValid) {
    return {
      success: false,
      message:
        "Current password is incorrect.",
    };
  }

  const samePassword =
    await verifyPassword(
      newPassword,
      user.passwordHash
    );

  if (samePassword) {
    return {
      success: false,
      message:
        "New password must be different from your current password.",
    };
  }

 const newPasswordHash =
  await hashPassword(newPassword);

await db
  .update(users)
  .set({
    passwordHash: newPasswordHash,
  })
  .where(
    eq(users.id, session.userId)
  );

await db
  .delete(userSessions)
  .where(
    eq(
      userSessions.userId,
      session.userId
    )
  );

return {
  success: true,
  message:
    "Password changed successfully. Please sign in again.",
};
}