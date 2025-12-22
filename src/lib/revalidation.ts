import { updateTag } from "next/cache";

/**
 * キャッシュタグベースのRevalidation
 * Next.js 16の"use cache"ディレクティブと連携
 *
 * Server Actionsでは updateTag を使用（read-your-own-writes シナリオ）
 * ユーザーが自分の変更を即座に確認できる
 */

/**
 * レストラン作成時のキャッシュ更新
 * Server Actionsから呼ばれるため updateTag を使用
 */
export function revalidateOnRestaurantCreate() {
  updateTag("restaurants");
}

/**
 * レストラン更新時のキャッシュ更新
 */
export function revalidateOnRestaurantUpdate(_id: string) {
  updateTag("restaurants");
}

/**
 * レストランの営業状態切り替え時のキャッシュ更新
 */
export function revalidateOnRestaurantToggleActive() {
  updateTag("restaurants");
}

/**
 * カテゴリ作成時のキャッシュ更新
 */
export function revalidateOnCategoryCreate() {
  updateTag("categories");
}

/**
 * カテゴリ更新時のキャッシュ更新
 */
export function revalidateOnCategoryUpdate() {
  updateTag("categories");
}

/**
 * カテゴリ並び替え時のキャッシュ更新
 */
export function revalidateOnCategoryReorder() {
  updateTag("categories");
}

/**
 * カテゴリ削除時のキャッシュ更新
 */
export function revalidateOnCategoryDelete() {
  updateTag("categories");
}
