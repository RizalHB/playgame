"use server";

import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/auth/current-admin";

import { db } from "@/lib/database/database";
import { users } from "@/lib/database/schema";

export async function updateUserStatus(
  userId: string,
  status: "active" | "inactive",
) {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    return {
      error:
        "Administrator authentication required.",
    };
  }

  if (admin.id === userId) {
    return {
      error:
        "You cannot change your own administrator account status.",
    };
  }

  const user =
    await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

  if (!user) {
    return {
      error: "User not found.",
    };
  }

  await db
    .update(users)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return {
    success:
      status === "active"
        ? "User activated successfully."
        : "User deactivated successfully.",
  };
}