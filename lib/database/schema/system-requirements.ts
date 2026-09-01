import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { games } from "./games";

export const systemRequirements = sqliteTable("system_requirements", {
  id: id(),

  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => games.id),

  minimumOS: text("minimum_os"),
  minimumProcessor: text("minimum_processor"),
  minimumMemory: text("minimum_memory"),
  minimumGraphics: text("minimum_graphics"),
  minimumDirectX: text("minimum_directx"),
  minimumStorage: text("minimum_storage"),
  minimumNotes: text("minimum_notes"),

  recommendedOS: text("recommended_os"),
  recommendedProcessor: text("recommended_processor"),
  recommendedMemory: text("recommended_memory"),
  recommendedGraphics: text("recommended_graphics"),
  recommendedDirectX: text("recommended_directx"),
  recommendedStorage: text("recommended_storage"),
  recommendedNotes: text("recommended_notes"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const systemRequirementsRelations = relations(
  systemRequirements,
  ({ one }) => ({
    game: one(games, {
      fields: [systemRequirements.gameId],
      references: [games.id],
    }),
  })
);