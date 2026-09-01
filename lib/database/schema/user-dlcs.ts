import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";
import { dlcs } from "./dlcs";

export const userDlcs = sqliteTable("user_dlcs", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  dlcId: text("dlc_id")
    .notNull()
    .references(() => dlcs.id),

  installed: integer("installed", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => false),

  purchasedAt: integer("purchased_at", {
    mode: "timestamp_ms",
  }).notNull(),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const userDlcsRelations =
  relations(userDlcs, ({ one }) => ({
    user: one(users, {
      fields: [userDlcs.userId],
      references: [users.id],
    }),

    dlc: one(dlcs, {
      fields: [userDlcs.dlcId],
      references: [dlcs.id],
    }),
  }));