import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { games } from "./games";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { users } from "./users";

export const developerProfiles = sqliteTable("developer_profiles", {
  id: id(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  studioName: text("studio_name").notNull(),

  logoUrl: text("logo_url"),

  bannerUrl: text("banner_url"),

  website: text("website"),

  country: text("country"),

  foundedYear: integer("founded_year"),

  description: text("description"),

  verified: integer("verified", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => true),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const developerProfilesRelations = relations(
  developerProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [developerProfiles.userId],
      references: [users.id],
    }),

    games: many(games),
  })
);