import {
	pgTable,
	uuid,
	text,
	varchar,
	timestamp,
	boolean,
	integer,
	jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// BetterAuth required tables
export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at")
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$defaultFn(() => new Date()),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at")
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$defaultFn(() => new Date()),
});

export const accounts = pgTable("accounts", {
	id: uuid("id").primaryKey().defaultRandom(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	expiresAt: timestamp("expires_at"),
	password: text("password"),
	createdAt: timestamp("created_at")
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$defaultFn(() => new Date()),
});

export const verifications = pgTable("verifications", {
	id: uuid("id").primaryKey().defaultRandom(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at")
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$defaultFn(() => new Date()),
});

// Application-specific tables will be added here for lunch management

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));
