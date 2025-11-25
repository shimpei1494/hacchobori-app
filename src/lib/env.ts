import "dotenv/config";

// Load environment files in priority order:
// 1. .env.local (highest priority, git-ignored)
// 2. .env.development / .env.production (mode-specific)
// 3. .env (lowest priority, committed)

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // BetterAuth
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  // App Configuration
  APP_NAME: process.env.APP_NAME || "Hacchobori App",
  APP_URL: process.env.APP_URL || "http://localhost:3000",
} as const;

// Validation for required environment variables - DISABLED for local development
const _requiredEnvVars = ["DATABASE_URL", "BETTER_AUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] as const;

function _validateEnv() {
  // Temporarily disabled for local development without DB/auth
  // TODO: Re-enable when setting up production deployment
  /*
	const missing = requiredEnvVars.filter((key) => !env[key]);

	if (missing.length > 0) {
		console.warn(
			`Missing required environment variables: ${missing.join(", ")}`,
		);
		console.warn("Please check your .env.local file");

		if (process.env.NODE_ENV === "production") {
			throw new Error(
				`Missing required environment variables: ${missing.join(", ")}`,
			);
		}
	}
	*/
}

// Validate on import - currently disabled
// validateEnv();

export default env;
export type Env = typeof env;
