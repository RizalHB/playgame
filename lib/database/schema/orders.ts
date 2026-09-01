import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { orderItems } from "./order-items";
import { payments } from "./payments";
import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";


export const orders = sqliteTable("orders", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  orderNumber: text("order_number")
    .notNull()
    .unique(),

  subtotal: real("subtotal").notNull(),

  discountAmount: real("discount_amount")
    .notNull()
    .$defaultFn(() => 0),

  totalAmount: real("total_amount").notNull(),

  status: text("status")
    .notNull()
    .$defaultFn(() => "pending"),

  completedAt: integer("completed_at", {
    mode: "timestamp_ms",
  }),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const ordersRelations = relations(
  orders,
  ({ one, many }) => ({
    user: one(users, {
      fields: [orders.userId],
      references: [users.id],
    }),

    items: many(orderItems),

    payment: one(payments),
  })
);