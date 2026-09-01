"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/auth/current-user";

import {
  purchaseDlcOwnership,
} from "@/lib/services/dlc/dlc-service";

export async function purchaseDlc(
  dlcId: string
) {
  const userId =
    await getCurrentUserId();

  const result =
    await purchaseDlcOwnership(
      userId,
      dlcId
    );

  if (!result.success) {
    return result;
  }

  revalidatePath("/library");

  revalidatePath("/downloads");

  return {
    success: true,
    message:
      "DLC purchased successfully.",
  };
}