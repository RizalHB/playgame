import { and, eq } from "drizzle-orm";

import { db } from "../database";

import {
  developerProfiles,
  discounts,
  gameMedia,
  games,
  shoppingCartItems,
  shoppingCarts,
} from "../schema";

export async function getShoppingCart(userId: string) {
  const cart = await db
    .select({
      itemId: shoppingCartItems.id,

      cartId: shoppingCarts.id,

      gameId: games.id,

      title: games.title,

      developer: developerProfiles.studioName,

      basePrice: games.basePrice,

      discountPercent: discounts.percentage,

      headerUrl: gameMedia.url,
    })
    .from(shoppingCarts)

    .innerJoin(
      shoppingCartItems,
      eq(shoppingCartItems.cartId, shoppingCarts.id)
    )

    .innerJoin(
      games,
      eq(shoppingCartItems.gameId, games.id)
    )

    .innerJoin(
      developerProfiles,
      eq(games.developerId, developerProfiles.id)
    )

    .leftJoin(
      discounts,
      eq(discounts.gameId, games.id)
    )

    .leftJoin(
      gameMedia,
      and(
        eq(gameMedia.gameId, games.id),
        eq(gameMedia.type, "header")
      )
    )

    .where(eq(shoppingCarts.userId, userId));

  return cart.map((item) => {
    const price = Number(item.basePrice);

    const discount = Number(
      item.discountPercent ?? 0
    );

    const finalPrice =
      price * (1 - discount / 100);

    return {
      ...item,

      price,

      finalPrice,

      hasDiscount: discount > 0,
    };
  });
}

export async function getCartItemCount(
  userId: string
) {
  const cart = await getShoppingCart(userId);

  return cart.length;
}

export async function getCartTotal(
  userId: string
) {
  const cart = await getShoppingCart(userId);

  return cart.reduce(
    (total, item) => total + item.finalPrice,
    0
  );
}

export async function getCartPage(
  userId: string
) {
  const items = await getShoppingCart(userId);

  return {
    items,

    itemCount: items.length,

    total: items.reduce(
      (sum, item) => sum + item.finalPrice,
      0
    ),
  };
}