import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";
import { orderItems } from "./order-items";

export const refundRequests = sqliteTable("refund_requests", {
  id: id(),

  orderItemId: text("order_item_id")
    .notNull()
    .unique()
    .references(() => orderItems.id),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  reason: text("reason").notNull(),

  status: text("status")
    .notNull()
    .$defaultFn(() => "pending"),

  requestedAt: integer("requested_at", {
    mode: "timestamp_ms",
  }).notNull(),

  reviewedAt: integer("reviewed_at", {
    mode: "timestamp_ms",
  }),

  reviewedBy: text("reviewed_by")
    .references(() => users.id),

  adminNote: text("admin_note"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const refundRequestsRelations = relations(
  refundRequests,
  ({ one }) => ({
    orderItem: one(orderItems, {
      fields: [refundRequests.orderItemId],
      references: [orderItems.id],
    }),

    user: one(users, {
      fields: [refundRequests.userId],
      references: [users.id],
    }),

    reviewer: one(users, {
      fields: [refundRequests.reviewedBy],
      references: [users.id],
    }),
  })
);