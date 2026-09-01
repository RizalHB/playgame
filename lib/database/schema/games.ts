import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  id,
  createdAt,
  updatedAt,
} from "../helpers/columns";

import { developerProfiles } from "./developer-profiles";
import { gameMedia } from "./game-media";
import { systemRequirements } from "./system-requirements";
import { discounts } from "./discounts";
import { libraries } from "./libraries";
import { shoppingCartItems } from "./shopping-cart-items";
import { orderItems } from "./order-items";
import { gameSessions } from "./game-sessions";
import { dlcs } from "./dlcs";
import { gameInstallations } from "./game-installations";

export const GAME_STATUS = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  APPROVED: "approved",
  SCHEDULED: "scheduled",
  RELEASED: "released",
  REJECTED: "rejected",
} as const;

export type GameStatus =
  (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export const games = sqliteTable(
  "games",
  {
    id: id(),

    developerId: text("developer_id")
      .notNull()
      .references(() => developerProfiles.id),

    title: text("title").notNull(),

    shortDescription:
      text("short_description"),

    description:
      text("description"),

    basePrice:
      integer("base_price").notNull(),

    releaseDate:
      integer("release_date", {
        mode: "timestamp_ms",
      }),

    /*
     * Lifecycle source of truth.
     */
    status: text("status")
      .$type<GameStatus>()
      .notNull()
      .$defaultFn(
        () => GAME_STATUS.DRAFT,
      ),

    /*
     * Legacy compatibility field.
     *
     * New lifecycle code should use `status`.
     */
    isPublished: integer("is_published", {
      mode: "boolean",
    })
      .notNull()
      .$defaultFn(() => false),

    isPreOrder: integer("is_pre_order", {
      mode: "boolean",
    })
      .notNull()
      .$defaultFn(() => false),

    createdAt: createdAt(),

    updatedAt: updatedAt(),
  },

  (table) => [
    index("games_developer_id_idx")
      .on(table.developerId),

    index("games_status_idx")
      .on(table.status),

    index("games_release_date_idx")
      .on(table.releaseDate),
  ],
);

export const gamesRelations = relations(
  games,
  ({ one, many }) => ({
    developer: one(developerProfiles, {
      fields: [games.developerId],
      references: [developerProfiles.id],
    }),

    media: many(gameMedia),

    systemRequirements:
      one(systemRequirements),

    discounts: many(discounts),

    libraries: many(libraries),

    cartItems: many(shoppingCartItems),

    orderItems: many(orderItems),

    installations:
      many(gameInstallations),

    sessions:
      many(gameSessions),

    dlcs: many(dlcs),
  }),
);