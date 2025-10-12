/**
 * Restaurant Display Utilities
 *
 * ビュー層で使用する表示用ヘルパー関数
 * データ層（Server Actions）では加工せず、表示時にこれらの関数を使用する
 */

import type { RestaurantWithCategories } from "@/db/schema";

/**
 * 価格範囲をフォーマット
 * @example formatPrice(800, 1200) => "¥800-1,200"
 */
export function formatPrice(
	priceMin: number | null,
	priceMax: number | null,
): string {
	if (!priceMin || !priceMax) {
		return "価格未定";
	}
	return `¥${priceMin.toLocaleString()}-${priceMax.toLocaleString()}`;
}

/**
 * レストランの主カテゴリ名を取得
 * @example getPrimaryCategory(restaurant) => "カフェ"
 */
export function getPrimaryCategory(
	restaurant: RestaurantWithCategories,
): string {
	return restaurant.restaurantCategories[0]?.category.name || "未分類";
}

/**
 * レストランの全カテゴリ名を配列で取得
 * @example getCategoryNames(restaurant) => ["カフェ", "禁煙", "Wi-Fi"]
 */
export function getCategoryNames(
	restaurant: RestaurantWithCategories,
): string[] {
	return restaurant.restaurantCategories.map((rc) => rc.category.name);
}

/**
 * レストランのタグを取得（カテゴリ名と同じ）
 * @example getTags(restaurant) => ["カフェ", "禁煙", "Wi-Fi"]
 */
export function getTags(restaurant: RestaurantWithCategories): string[] {
	return getCategoryNames(restaurant);
}

/**
 * 評価値を数値に変換
 * Drizzleのnumeric型はstring | nullで返されるため、numberに変換
 */
export function parseRating(rating: string | null): number | null {
	if (!rating) return null;
	const parsed = Number(rating);
	return Number.isNaN(parsed) ? null : parsed;
}
