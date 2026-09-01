import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { gameSessions } from "./game-sessions";
import { id, createdAt, updatedAt } from "../helpers/columns";
import { roles } from "./roles";
import { relations } from "drizzle-orm";
import { gamerProfiles } from "./gamer-profiles";
import { developerProfiles } from "./developer-profiles";
import { libraries } from "./libraries";
import { gameInstallations } from "./game-installations";
import { shoppingCarts } from "./shopping-carts";
import { orders } from "./orders";
import { refundRequests } from "./refund-requests";
import { userDlcs } from "./user-dlcs";
import { userSessions } from "./sessions";
export const users = sqliteTable("users", {
  id: id(),

  roleId: text("role_id")
    .notNull()
    .references(() => roles.id),

  email: text("email")
    .notNull()
    .unique(),

  username: text("username")
    .notNull()
    .unique(),

  passwordHash: text("password_hash")
    .notNull(),

  emailVerified: integer("email_verified", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => false),

  twoFactorEnabled: integer("two_factor_enabled", {
    mode: "boolean",
  })
    .notNull()
    .$defaultFn(() => false),

  status: text("status")
    .notNull()
    .$defaultFn(() => "active"),

  createdAt: createdAt(),

  updatedAt: updatedAt(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),

  gamerProfile: one(gamerProfiles),

  developerProfile: one(developerProfiles),

  libraries: many(libraries),

  installations: many(gameInstallations),

  shoppingCart: one(shoppingCarts),

  orders: many(orders),

  refundRequests: many(refundRequests),

  gameSessions: many(gameSessions),

  userSessions: many(userSessions),

  dlcs: many(userDlcs),
  
}));