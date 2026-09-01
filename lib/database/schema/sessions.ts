import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { relations } from "drizzle-orm";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";

export const userSessions = sqliteTable(
  "sessions",
  {
    id: id(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    token: text("token")
      .notNull()
      .unique(),

    expiresAt: integer(
      "expires_at",
      {
        mode: "timestamp_ms",
      }
    ).notNull(),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  }
);

export const sessionsRelations =
  relations(
    userSessions,
    ({ one }) => ({
      user: one(users, {
        fields: [
          userSessions.userId,
        ],
        references: [
          users.id,
        ],
      }),
    })
  );