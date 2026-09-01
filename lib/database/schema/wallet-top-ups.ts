import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { wallets } from "./wallets";

export const walletTopUps = sqliteTable("wallet_top_ups", {
  id: id(),

  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id),

  amount: integer("amount")
    .notNull(),

  currency: text("currency")
    .notNull()
    .$defaultFn(() => "IDR"),

  paymentMethod: text("payment_method")
    .notNull(),

  provider: text("provider")
    .notNull(),

  status: text("status")
    .notNull()
    .$defaultFn(() => "pending"),

  transactionReference: text("transaction_reference")
    .notNull()
    .unique(),

  idempotencyKey: text("idempotency_key")
    .notNull()
    .unique(),
  paymentToken: text("payment_token")
    .notNull()
    .unique(),
  expiresAt: integer("expires_at", {
    mode: "timestamp_ms",
  }),
  paidAt: integer("paid_at", {
    mode: "timestamp_ms",
  }),

  completedAt: integer("completed_at", {
    mode: "timestamp_ms",
  }),

  failureReason: text("failure_reason"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const walletTopUpsRelations =
  relations(
    walletTopUps,
    ({ one }) => ({
      wallet: one(wallets, {
        fields: [
          walletTopUps.walletId,
        ],
        references: [
          wallets.id,
        ],
      }),
    })
  );