import { sql } from "drizzle-orm";
import { db } from "./db";

export async function resetDatabase() {
  try {
    console.log("🗑️ Resetting database...");

    // Drop all tables (in reverse dependency order)
    await db.execute(sql`DROP TABLE IF EXISTS logs CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS todos CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS schedules CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS equipments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS verifications CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS accounts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    // Drop migration table
    await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE`);

    console.log("✅ Database reset completed");
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    throw error;
  }
}

export async function listTables() {
  try {
    const result = await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log("📋 Database Tables:");
    result.forEach((row: any) => {
      console.log(`  - ${row.tablename}`);
    });

    return result.map((row: any) => row.tablename);
  } catch (error) {
    console.error("Failed to list tables:", error);
    return [];
  }
}

export async function getTableRowCounts() {
  try {
    const tables = await listTables();
    console.log("📊 Table Row Counts:");

    for (const tableName of tables) {
      try {
        const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
        const count = result[0]?.count || 0;
        console.log(`  ${tableName}: ${count} rows`);
      } catch (error) {
        console.log(`  ${tableName}: Error counting rows`);
      }
    }
  } catch (error) {
    console.error("Failed to get table row counts:", error);
  }
}
