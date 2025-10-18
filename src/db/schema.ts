import { relations } from "drizzle-orm";
import { boolean, integer, numeric, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// BetterAuth required tables
export const users = pgTable("users", {
  // ========================================
  // Better Auth必須フィールド（変更不可）
  // ========================================
  id: text("id").primaryKey(),
  name: text("name").notNull(), // Googleプロフィール名（自動更新される可能性あり）
  email: varchar("email", { length: 255 }).notNull().unique(), // Google認証用メールアドレス
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"), // Googleプロフィール画像
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  // ========================================
  // アプリ固有フィールド（ユーザーが変更可能）
  // ========================================
  displayName: text("display_name"), // ユーザーが設定する表示名（優先表示）
  companyEmail: varchar("company_email", { length: 255 }), // 会社用メールアドレス
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Application-specific tables for lunch management

// categories テーブル (カフェ、ラーメン、定食、イタリアン、和食、中華、海鮮など)
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// restaurants テーブル
export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }), // 0.0 ~ 5.0
  priceMin: integer("price_min"), // 最低価格(円)
  priceMax: integer("price_max"), // 最高価格(円)
  distance: varchar("distance", { length: 50 }), // "2分", "5分"など
  address: text("address"),
  tabelogUrl: text("tabelog_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// restaurant_categories (多対多中間テーブル)
export const restaurantCategories = pgTable(
  "restaurant_categories",
  {
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.restaurantId, table.categoryId] })],
);

// favorites (お気に入り)
export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.restaurantId] })],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  favorites: many(favorites),
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

export const categoriesRelations = relations(categories, ({ many }) => ({
  restaurantCategories: many(restaurantCategories),
}));

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  restaurantCategories: many(restaurantCategories),
  favorites: many(favorites),
}));

export const restaurantCategoriesRelations = relations(restaurantCategories, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantCategories.restaurantId],
    references: [restaurants.id],
  }),
  category: one(categories, {
    fields: [restaurantCategories.categoryId],
    references: [categories.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [favorites.restaurantId],
    references: [restaurants.id],
  }),
}));

// ============================================
// Type Exports (Inferred from Schema)
// ============================================

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Verification = InferSelectModel<typeof verifications>;
export type NewVerification = InferInsertModel<typeof verifications>;

// Application types
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Restaurant = InferSelectModel<typeof restaurants>;
export type NewRestaurant = InferInsertModel<typeof restaurants>;

export type RestaurantCategory = InferSelectModel<typeof restaurantCategories>;
export type NewRestaurantCategory = InferInsertModel<typeof restaurantCategories>;

export type Favorite = InferSelectModel<typeof favorites>;
export type NewFavorite = InferInsertModel<typeof favorites>;

// Relational types for query results
export type RestaurantWithCategories = Restaurant & {
  restaurantCategories: Array<{
    category: Category;
  }>;
};

export type RestaurantWithFull = Restaurant & {
  restaurantCategories: Array<{
    category: Category;
  }>;
  favorites: Favorite[];
};
