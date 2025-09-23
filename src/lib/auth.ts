import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import * as schema from "../db/schema";
import env from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			users: schema.users,
			sessions: schema.sessions,
			accounts: schema.accounts,
			verifications: schema.verifications,
		},
	}),
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (update session every day)
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
		},
	},
	user: {
		deleteUser: {
			enabled: true,
		},
		changeEmail: {
			enabled: true,
			requireEmailVerification: true,
		},
		changePassword: {
			enabled: false, // Disabled since we're using Google OAuth only
		},
	},
	emailAndPassword: {
		enabled: false, // Disabled - Google OAuth only
	},
	emailVerification: {
		enabled: true,
		autoSignInAfterVerification: true,
	},
	trustedOrigins: [env.BETTER_AUTH_URL],
	advanced: {
		generateId: () => crypto.randomUUID(),
	},
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
