import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { gameGenres } from "./game-genres";

export const genres = sqliteTable("genres", {
  id: id(),

  name: text("name")
    .notNull()
    .unique(),

  description: text("description"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const genresRelations = relations(
  genres,
  ({ many }) => ({
    games: many(gameGenres),
  })
);