/**
 * キャッシュタグの定数定義
 * Next.js 16 Cache Components の use cache ディレクティブと updateTag() で使用
 *
 * @example
 * // 読み取り操作
 * cacheTag(CACHE_TAG.RESTAURANTS);
 *
 * // 更新操作
 * updateTag(CACHE_TAG.RESTAURANTS);
 */
export const CACHE_TAG = {
  /** レストラン関連のキャッシュタグ */
  RESTAURANTS: "restaurants",
  /** カテゴリ関連のキャッシュタグ */
  CATEGORIES: "categories",
} as const;
