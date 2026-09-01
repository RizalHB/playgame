import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/database/schema/schema.ts",
  out: "./lib/database/migrations",
  dialect: "sqlite",

  dbCredentials: {
    url: "file:./playgame.db",
  },

  verbose: true,
  strict: true,
});