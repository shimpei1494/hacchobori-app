"use server";

import { db } from "@/db/db";
import { restaurants, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { RestaurantWithCategories, Category } from "@/db/schema";

/**
 * レストラン一覧を取得（カテゴリ情報含む）
 * 純粋なDBデータを返す。表示用の加工はビュー層で行う。
 */
export async function getRestaurants(): Promise<RestaurantWithCategories[]> {
	try {
		const result = await db.query.restaurants.findMany({
			where: eq(restaurants.isActive, true),
			with: {
				restaurantCategories: {
					with: {
						category: true,
					},
				},
			},
			orderBy: [desc(restaurants.rating)],
		});

		// DBデータをそのまま返す（型のみ）
		return result;
	} catch (error) {
		console.error("Failed to fetch restaurants:", error);
		return [];
	}
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories(): Promise<Category[]> {
	try {
		return await db.query.categories.findMany({
			orderBy: [categories.displayOrder],
		});
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return [];
	}
}
