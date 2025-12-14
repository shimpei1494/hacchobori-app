import { revalidatePath } from "next/cache";

/**
 * Revalidationパスの定義
 * アプリ全体のキャッシュ無効化ルールを一元管理
 */
export const REVALIDATION_PATHS = {
  /**
   * レストラン関連のrevalidation
   */
  restaurants: {
    /** レストラン作成時に無効化するパス */
    onCreate: [
      "/", // トップページ（レストラン一覧）
      "/categories", // カテゴリページ（カテゴリ別レストラン数）
    ],
    /** レストラン更新時に無効化するパス */
    onUpdate: (id: string) => [
      "/", // トップページ（レストラン一覧）
      "/categories", // カテゴリページ（カテゴリ別レストラン数）
      `/restaurants/${id}/edit`, // 編集ページ
    ],
    /** レストランの営業状態切り替え時に無効化するパス */
    onToggleActive: [
      "/", // トップページ（レストラン一覧）
      "/restaurants/closed", // 閉店店舗一覧
    ],
  },
  /**
   * カテゴリ関連のrevalidation
   */
  categories: {
    /** カテゴリ作成時に無効化するパス */
    onCreate: [
      "/", // トップページ（カテゴリフィルタ）
      "/categories", // カテゴリ管理ページ
    ],
    /** カテゴリ更新時に無効化するパス */
    onUpdate: [
      "/", // トップページ（カテゴリフィルタ）
      "/categories", // カテゴリ管理ページ
    ],
    /** カテゴリ並び替え時に無効化するパス */
    onReorder: [
      "/", // トップページ（カテゴリフィルタ）
      "/categories", // カテゴリ管理ページ
    ],
    /** カテゴリ削除時に無効化するパス */
    onDelete: [
      "/", // トップページ（カテゴリフィルタ）
      "/categories", // カテゴリ管理ページ
    ],
  },
} as const;

/**
 * レストラン作成時のキャッシュ再検証
 */
export function revalidateOnRestaurantCreate() {
  for (const path of REVALIDATION_PATHS.restaurants.onCreate) {
    revalidatePath(path);
  }
}

/**
 * レストラン更新時のキャッシュ再検証
 */
export function revalidateOnRestaurantUpdate(id: string) {
  for (const path of REVALIDATION_PATHS.restaurants.onUpdate(id)) {
    revalidatePath(path);
  }
}

/**
 * レストランの営業状態切り替え時のキャッシュ再検証
 */
export function revalidateOnRestaurantToggleActive() {
  for (const path of REVALIDATION_PATHS.restaurants.onToggleActive) {
    revalidatePath(path);
  }
}

/**
 * カテゴリ作成時のキャッシュ再検証
 */
export function revalidateOnCategoryCreate() {
  for (const path of REVALIDATION_PATHS.categories.onCreate) {
    revalidatePath(path);
  }
}

/**
 * カテゴリ更新時のキャッシュ再検証
 */
export function revalidateOnCategoryUpdate() {
  for (const path of REVALIDATION_PATHS.categories.onUpdate) {
    revalidatePath(path);
  }
}

/**
 * カテゴリ並び替え時のキャッシュ再検証
 */
export function revalidateOnCategoryReorder() {
  for (const path of REVALIDATION_PATHS.categories.onReorder) {
    revalidatePath(path);
  }
}

/**
 * カテゴリ削除時のキャッシュ再検証
 */
export function revalidateOnCategoryDelete() {
  for (const path of REVALIDATION_PATHS.categories.onDelete) {
    revalidatePath(path);
  }
}
