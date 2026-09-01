import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { shoppingCarts } from "./shopping-carts";
import { games } from "./games";

export const shoppingCartItems = sqliteTable("shopping_cart_items", {
  id: id(),

  cartId: text("cart_id")
    .notNull()
    .references(() => shoppingCarts.id),

  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const shoppingCartItemsRelations = relations(
  shoppingCartItems,
  ({ one }) => ({
    cart: one(shoppingCarts, {
      fields: [shoppingCartItems.cartId],
      references: [shoppingCarts.id],
    }),

    game: one(games, {
      fields: [shoppingCartItems.gameId],
      references: [games.id],
    }),
  })
);