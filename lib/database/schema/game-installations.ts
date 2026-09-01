import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  createdAt,
  id,
  updatedAt,
} from "../helpers/columns";

import { games } from "./games";
import { users } from "./users";

export const gameInstallations =
  sqliteTable("game_installations", {
    id: id(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    gameId: text("game_id")
      .notNull()
      .references(() => games.id),

    status: text("status")
      .notNull()
      .$defaultFn(() => "not_installed"),

      downloadProgress: integer("download_progress")
  .notNull()
  .$defaultFn(() => 0),
      installationProgress: integer(
        "installation_progress"
      )
      .notNull()
      .$defaultFn(() => 0),
      downloadSpeedMbps: integer("download_speed_mbps")
        .notNull()
        .$defaultFn(() => 0),

      remainingSeconds: integer("remaining_seconds")
        .notNull()
        .$defaultFn(() => 0),

      currentOperation: text("current_operation")
        .notNull()
        .$defaultFn(() => "idle"),

          installPath: text("install_path"),

          installedVersion: text(
            "installed_version"
          ),

    launcherVersion: text("launcher_version"),

    installSizeBytes: integer(
      "install_size_bytes",
      {
        mode: "number",
      }
    ).notNull().$defaultFn(() => 0),

    installedAt: integer(
      "installed_at",
      {
        mode: "timestamp_ms",
      }
    ),

    lastPlayedAt: integer(
      "last_played_at",
      {
        mode: "timestamp_ms",
      }
    ),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  });

export const
gameInstallationsRelations =
relations(
  gameInstallations,
  ({ one }) => ({
    user: one(users, {
      fields: [
        gameInstallations.userId,
      ],
      references: [users.id],
    }),

    game: one(games, {
      fields: [
        gameInstallations.gameId,
      ],
      references: [games.id],
    }),
  })
);