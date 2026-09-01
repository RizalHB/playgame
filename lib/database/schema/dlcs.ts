import { relations } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { userDlcs } from "./user-dlcs";
import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { games } from "./games";

export const dlcs =
  sqliteTable("dlcs", {

    id: id(),

    gameId: text("game_id")
      .notNull()
      .references(() => games.id),

    title: text("title")
      .notNull(),

    description: text("description"),

    price: real("price")
      .notNull(),

    releaseDate: integer(
      "release_date",
      {
        mode: "timestamp_ms",
      }
    ),

    installSizeBytes:
      integer(
        "install_size_bytes",
        {
          mode: "number",
        }
      )
      .notNull()
      .$defaultFn(() => 0),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  });

export const dlcsRelations =
  relations(dlcs, ({ one, many  }) => ({

    game: one(games, {
      fields: [dlcs.gameId],
      references: [games.id],
    }),
    owners: many(userDlcs),
  }));