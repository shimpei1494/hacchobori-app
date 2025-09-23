declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Next.js
			NODE_ENV: "development" | "production" | "test";

			// Database
			DATABASE_URL: string;

			// BetterAuth
			BETTER_AUTH_SECRET: string;
			BETTER_AUTH_URL: string;

			// Google OAuth
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;

			// App Configuration
			APP_NAME?: string;
			APP_URL?: string;
		}
	}
}

export {};
