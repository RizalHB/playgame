"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/database/database";

import {
  libraries,
  shoppingCartItems,
  shoppingCarts,
} from "@/lib/database/schema";

import { getCurrentUserId } from "@/lib/auth/current-user";

async function getOrCreateCart(userId: string) {
  const existingCart = await db.query.shoppingCarts.findFirst({
    where: eq(shoppingCarts.userId, userId),
  });

  if (existingCart) {
    return existingCart;
  }

  const cartId = crypto.randomUUID();

  await db.insert(shoppingCarts).values({
    id: cartId,
    userId,
  });

  return {
    id: cartId,
    userId,
  };
}

export async function addToCart(gameId: string) {
  const userId = await getCurrentUserId();

  const cart = await getOrCreateCart(userId);

  // Already owned?
  const ownedGame = await db.query.libraries.findFirst({
    where: and(
      eq(libraries.userId, userId),
      eq(libraries.gameId, gameId)
    ),
  });

  if (ownedGame) {
    return {
      success: false,
      reason: "owned",
      message: "You already own this game.",
    };
  }

  // Already in cart?
  const existingItem =
    await db.query.shoppingCartItems.findFirst({
      where: and(
        eq(shoppingCartItems.cartId, cart.id),
        eq(shoppingCartItems.gameId, gameId)
      ),
    });

  if (existingItem) {
    return {
      success: true,
      reason: "exists",
      message: "Game is already in your cart.",
    };
  }

  // Insert item
  await db.insert(shoppingCartItems).values({
    id: crypto.randomUUID(),
    cartId: cart.id,
    gameId,
  });

  revalidatePath("/cart");

  return {
    success: true,
    reason: "added",
    message: "Game added to cart.",
  };
}

export async function removeFromCart(itemId: string) {
  await db
    .delete(shoppingCartItems)
    .where(eq(shoppingCartItems.id, itemId));

  revalidatePath("/cart");
}

export async function clearCart() {
  const userId = await getCurrentUserId();

  const cart = await db.query.shoppingCarts.findFirst({
    where: eq(shoppingCarts.userId, userId),
  });

  if (!cart) {
    return;
  }

  await db
    .delete(shoppingCartItems)
    .where(eq(shoppingCartItems.cartId, cart.id));

  revalidatePath("/cart");
}