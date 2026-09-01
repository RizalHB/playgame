import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { wallets } from "./wallets";

export const walletTransactions = sqliteTable(
  "wallet_transactions",
  {
    id: id(),

    walletId: text("wallet_id")
      .notNull()
      .references(() => wallets.id),

    type: text("type")
      .notNull(),

    amount: integer("amount")
      .notNull(),

    balanceBefore: integer("balance_before")
      .notNull(),

    balanceAfter: integer("balance_after")
      .notNull(),

    referenceType: text("reference_type"),

    referenceId: text("reference_id"),

    transactionKey: text("transaction_key")
      .notNull()
      .unique(),

    description: text("description"),

    status: text("status")
      .notNull()
      .$defaultFn(() => "completed"),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  }
);

export const walletTransactionsRelations =
  relations(
    walletTransactions,
    ({ one }) => ({
      wallet: one(wallets, {
        fields: [
          walletTransactions.walletId,
        ],
        references: [wallets.id],
      }),
    })
  );