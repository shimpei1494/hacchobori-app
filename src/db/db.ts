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

// Create typed db instance
const createDb = () => {
	if (isNeonUrl) {
		// Neon Serverless configuration
		neonConfig.fetchConnectionCache = true;
		const pool = new Pool({ connectionString: env.DATABASE_URL });
		return neonDrizzle(pool, { schema });
	}

	// Regular PostgreSQL configuration
	const client = postgres(env.DATABASE_URL, {
		max: 1,
		onnotice: env.NODE_ENV === "development" ? console.log : undefined,
	});
	return drizzle(client, { schema });
};

export const db = createDb();

// Migration client for backwards compatibility
export const migrationClient = isNeonUrl
	? new Pool({ connectionString: env.DATABASE_URL })
	: postgres(env.DATABASE_URL, { max: 1 });

export type Database = typeof db;
