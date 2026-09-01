import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { games } from "./games";
import { categories } from "./categories";

export const gameCategories = sqliteTable("game_categories", {
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});

export const gameCategoriesRelations = relations(
  gameCategories,
  ({ one }) => ({
    game: one(games, {
      fields: [gameCategories.gameId],
      references: [games.id],
    }),

    category: one(categories, {
      fields: [gameCategories.categoryId],
      references: [categories.id],
    }),
  })
);