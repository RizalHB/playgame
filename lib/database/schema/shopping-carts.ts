import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { shoppingCartItems } from "./shopping-cart-items";
import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";

export const shoppingCarts = sqliteTable("shopping_carts", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const shoppingCartsRelations = relations(
  shoppingCarts,
  ({ one, many }) => ({
    user: one(users, {
      fields: [shoppingCarts.userId],
      references: [users.id],
    }),

    items: many(shoppingCartItems),
  })
);