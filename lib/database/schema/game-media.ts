import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { games } from "./games";

export const gameMedia = sqliteTable("game_media", {
  id: id(),

  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  type: text("type").notNull(),

  mediaType: text("media_type")
    .notNull()
    .$defaultFn(() => "image"),

  title: text("title"),

  altText: text("alt_text"),

  url: text("url").notNull(),

  thumbnailUrl: text("thumbnail_url"),

  isPrimary: integer("is_primary", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => false),

  displayOrder: integer("display_order")
    .notNull()
    .$defaultFn(() => 1),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const gameMediaRelations = relations(gameMedia, ({ one }) => ({
  game: one(games, {
    fields: [gameMedia.gameId],
    references: [games.id],
  }),
}));