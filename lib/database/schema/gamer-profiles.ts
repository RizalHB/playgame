import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";

export const gamerProfiles = sqliteTable("gamer_profiles", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  displayName: text("display_name").notNull(),

  avatarUrl: text("avatar_url"),

  country: text("country"),

  language: text("language")
    .notNull()
    .$defaultFn(() => "en"),

  bio: text("bio"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const gamerProfilesRelations = relations(
  gamerProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [gamerProfiles.userId],
      references: [users.id],
    }),
  })
);