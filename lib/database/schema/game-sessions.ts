import { relations } from "drizzle-orm";

import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  createdAt,
  id,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";
import { games } from "./games";

export const gameSessions =
  sqliteTable("game_sessions", {
    id: id(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    gameId: text("game_id")
      .notNull()
      .references(() => games.id),

    status: text("status")
      .notNull()
      .$defaultFn(() => "playing"),

    playTimeMinutes: integer(
      "play_time_minutes"
    )
      .notNull()
      .$defaultFn(() => 0),

    startedAt: integer(
      "started_at",
      {
        mode: "timestamp_ms",
      }
    ).notNull(),

    endedAt: integer(
      "ended_at",
      {
        mode: "timestamp_ms",
      }
    ),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  });

export const gameSessionsRelations =
  relations(
    gameSessions,
    ({ one }) => ({
      user: one(users, {
        fields: [
          gameSessions.userId,
        ],
        references: [users.id],
      }),

      game: one(games, {
        fields: [
          gameSessions.gameId,
        ],
        references: [games.id],
      }),
    })
  );