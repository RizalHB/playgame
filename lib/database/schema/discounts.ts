import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { games } from "./games";

export const discounts = sqliteTable("discounts", {
  id: id(),

  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  title: text("title").notNull(),

  type: text("type").notNull(),

  percentage: integer("percentage").notNull(),

  startDate: integer("start_date", {
    mode: "timestamp_ms",
  }).notNull(),

  endDate: integer("end_date", {
    mode: "timestamp_ms",
  }).notNull(),

  isActive: integer("is_active", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => true),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const discountsRelations = relations(discounts, ({ one }) => ({
  game: one(games, {
    fields: [discounts.gameId],
    references: [games.id],
  }),
}));