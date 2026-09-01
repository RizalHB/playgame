import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { orders } from "./orders";

export const payments = sqliteTable("payments", {
  id: id(),

  orderId: text("order_id")
    .notNull()
    .unique()
    .references(() => orders.id),

  paymentMethod: text("payment_method").notNull(),

  provider: text("provider").notNull(),

  amount: real("amount").notNull(),

  status: text("status")
    .notNull()
    .$defaultFn(() => "pending"),

  transactionReference: text("transaction_reference")
    .notNull()
    .unique(),

  paidAt: integer("paid_at", {
    mode: "timestamp_ms",
  }),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const paymentsRelations = relations(
  payments,
  ({ one }) => ({
    order: one(orders, {
      fields: [payments.orderId],
      references: [orders.id],
    }),
  })
);