import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { id } from "../helpers/columns";

export const roles = sqliteTable("roles", {
  id: id(),

  name: text("name")
    .notNull()
    .unique(),

  description: text("description"),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));