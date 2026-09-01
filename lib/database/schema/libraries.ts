import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";
import { games } from "./games";

export const libraries = sqliteTable(
  "libraries",
  {
    id: id(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    gameId: text("game_id")
      .notNull()
      .references(() => games.id),

    purchasedAt: integer("purchased_at", {
      mode: "timestamp_ms",
    }).notNull(),

    playTimeMinutes: integer(
      "play_time_minutes",
    )
      .notNull()
      .$defaultFn(() => 0),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  },
  (table) => ({
    userGameUnique: unique(
      "libraries_user_game_unique",
    ).on(
      table.userId,
      table.gameId,
    ),
  }),
);

export const librariesRelations =
  relations(
    libraries,
    ({ one }) => ({
      user: one(users, {
        fields: [
          libraries.userId,
        ],
        references: [
          users.id,
        ],
      }),

      game: one(games, {
        fields: [
          libraries.gameId,
        ],
        references: [
          games.id,
        ],
      }),
    }),
  );