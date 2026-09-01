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

import { games } from "./games";
import { users } from "./users";

export const reviews = sqliteTable(
  "reviews",
  {
    id: id(),

    gameId: text("game_id")
      .notNull()
      .references(() => games.id),

    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    recommended: integer("recommended", {
      mode: "boolean",
    }).notNull(),

    title: text("title"),

    review: text("review").notNull(),

    hoursPlayed: integer("hours_played")
      .notNull()
      .$defaultFn(() => 0),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  },
  (table) => ({
    userGameUnique: unique(
      "reviews_user_game_unique",
    ).on(
      table.userId,
      table.gameId,
    ),
  }),
);

export const reviewRelations = relations(
  reviews,
  ({ one }) => ({
    game: one(games, {
      fields: [reviews.gameId],
      references: [games.id],
    }),

    user: one(users, {
      fields: [reviews.userId],
      references: [users.id],
    }),
  }),
);