import { sql } from "drizzle-orm";
import { db } from "./db";

interface DbVersionResult {
  version?: string;
}

interface DbNameResult {
  current_database?: string;
}

async function checkDatabaseHealth() {
  try {
    console.log("🔍 Checking database connection...");

    // Simple health check query
    const result = await db.execute(sql`SELECT 1 as health`);

    if (result && Array.isArray(result) && result.length > 0) {
      console.log("✅ Database connection successful");
      return true;
    } else {
      console.error("❌ Database query returned unexpected result");
      return false;
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

async function getDatabaseInfo() {
  try {
    const versionResult = await db.execute(sql`SELECT version()`);
    const currentDbResult = await db.execute(sql`SELECT current_database()`);

    const versionRow = Array.isArray(versionResult) ? (versionResult[0] as DbVersionResult) : undefined;
    const dbRow = Array.isArray(currentDbResult) ? (currentDbResult[0] as DbNameResult) : undefined;

    console.log("📊 Database Info:");
    console.log(`  Version: ${versionRow?.version?.split(" ")[1] || "Unknown"}`);
    console.log(`  Database: ${dbRow?.current_database || "Unknown"}`);

    return {
      version: versionRow?.version,
      database: dbRow?.current_database,
    };
  } catch (error) {
    console.error("Failed to get database info:", error);
    return null;
  }
}

// Run health check if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const isHealthy = await checkDatabaseHealth();
    if (isHealthy) {
      await getDatabaseInfo();
    }
    process.exit(isHealthy ? 0 : 1);
  })();
}

export { checkDatabaseHealth, getDatabaseInfo };
