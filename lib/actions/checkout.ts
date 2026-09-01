"use server";
import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/services/checkout/create-order";
export async function completePurchase() {
  const result = await createOrder();
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/library");
  return result;
}