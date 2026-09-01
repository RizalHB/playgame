import fs from "node:fs";
import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:./playgame.db",
});

const migrationPath =
  "./lib/database/migrations/0000_fix_migration20_error.sql";

async function main() {
  console.log("Reading migration:");
  console.log(migrationPath);
  console.log();

  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  const statements = sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

  console.log(
    `Found ${statements.length} SQL statements.\n`,
  );

  for (let index = 0; index < statements.length; index++) {
    const statement = statements[index];

    console.log(
      `\n========== STATEMENT ${index + 1}/${statements.length} ==========`,
    );

    console.log(statement);

    try {
      await db.execute(statement);

      console.log(
        `✅ Statement ${index + 1} succeeded.`,
      );
    } catch (error) {
      console.error(
        `\n❌ STATEMENT ${index + 1} FAILED\n`,
      );

      console.error(error);

      process.exitCode = 1;
      return;
    }
  }

  console.log(
    "\n🎉 Migration 0000 executed successfully.",
  );
}

main().catch((error) => {
  console.error(
    "\n💥 Diagnostic failed:",
  );

  console.error(error);

  process.exitCode = 1;
});