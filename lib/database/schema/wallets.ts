import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";
import { walletTransactions } from "./wallet-transactions";

export const wallets = sqliteTable("wallets", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  balance: integer("balance")
    .notNull()
    .$defaultFn(() => 0),

  currency: text("currency")
    .notNull()
    .$defaultFn(() => "IDR"),

  status: text("status")
    .notNull()
    .$defaultFn(() => "active"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const walletsRelations = relations(
  wallets,
  ({ one, many }) => ({
    user: one(users, {
      fields: [wallets.userId],
      references: [users.id],
    }),

    transactions: many(walletTransactions),
  })
);