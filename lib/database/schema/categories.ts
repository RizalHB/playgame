import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { gameCategories } from "./game-categories";

export const categories = sqliteTable("categories", {
  id: id(),

  name: text("name")
    .notNull()
    .unique(),

  description: text("description"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const categoriesRelations = relations(
  categories,
  ({ many }) => ({
    games: many(gameCategories),
  })
);