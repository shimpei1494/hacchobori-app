import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import postgres from "postgres";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import env from "../lib/env";

// Determine if we're using Neon (serverless) or regular Postgres
const isNeonUrl =
	env.DATABASE_URL.includes("neon.db") ||
	env.DATABASE_URL.includes("neondb.net");

let db: ReturnType<typeof drizzle> | ReturnType<typeof neonDrizzle>;
let migrationClient: postgres.Sql | Pool;

if (isNeonUrl) {
	// Neon Serverless configuration
	neonConfig.fetchConnectionCache = true;

	const pool = new Pool({ connectionString: env.DATABASE_URL });
	db = neonDrizzle(pool, { schema });
	migrationClient = pool;
} else {
	// Regular PostgreSQL configuration
	const client = postgres(env.DATABASE_URL, {
		max: 1,
		onnotice: env.NODE_ENV === "development" ? console.log : undefined,
	});

	db = drizzle(client, { schema });
	migrationClient = client;
}

export { db, migrationClient };
export type Database = typeof db;
