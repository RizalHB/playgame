import { createClient } from "@libsql/client";

async function main() {
  const db = createClient({
    url: "file:./playgame.db",
  });

  console.log("\n=== DATABASE TABLES ===");

  const tables = await db.execute(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
  `);

  console.table(tables.rows);

  console.log("\n=== DRIZZLE MIGRATION TABLE ===");

  const migrationSchema = await db.execute(`
    SELECT sql
    FROM sqlite_master
    WHERE type = 'table'
      AND name = '__drizzle_migrations'
  `);

  console.table(migrationSchema.rows);

  console.log("\n=== DRIZZLE MIGRATION ROWS ===");

  const migrations = await db.execute(`
    SELECT *
    FROM __drizzle_migrations
    ORDER BY id
  `);

  console.table(migrations.rows);

  console.log("\n=== DATABASE LOCATION TEST ===");

  const databaseList = await db.execute(`
    PRAGMA database_list
  `);

  console.table(databaseList.rows);
}

main().catch((error) => {
  console.error("\nDatabase inspection failed:");
  console.error(error);
  process.exit(1);
});