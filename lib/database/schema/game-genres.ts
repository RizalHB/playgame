import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { games } from "./games";
import { genres } from "./genres";

export const gameGenres = sqliteTable("game_genres", {
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),

  genreId: text("genre_id")
    .notNull()
    .references(() => genres.id),
});

export const gameGenresRelations = relations(
  gameGenres,
  ({ one }) => ({
    game: one(games, {
      fields: [gameGenres.gameId],
      references: [games.id],
    }),

    genre: one(genres, {
      fields: [gameGenres.genreId],
      references: [genres.id],
    }),
  })
);