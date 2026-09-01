import { relations } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { orders } from "./orders";
import { games } from "./games";
import { refundRequests } from "./refund-requests";

export const orderItems = sqliteTable("order_items", {
  id: id(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),

  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  gameTitle: text("game_title")
    .notNull(),

  unitPrice: real("unit_price").notNull(),

  discountPercentage: real("discount_percentage")
    .notNull()
    .$defaultFn(() => 0),

  finalPrice: real("final_price").notNull(),

  developerAmount: real("developer_amount") .notNull() .$defaultFn(() => 0), 
  
  platformAmount: real("platform_amount") .notNull() .$defaultFn(() => 0),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const orderItemsRelations = relations(
  orderItems,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),

    game: one(games, {
      fields: [orderItems.gameId],
      references: [games.id],
    }),
    refundRequest: one(refundRequests),
  })
);