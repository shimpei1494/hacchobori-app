"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import type { Category, NewRestaurant, RestaurantWithCategories } from "@/db/schema";
import { categories, restaurantCategories, restaurants } from "@/db/schema";

/**
 * レストラン操作の結果型
 */
export type RestaurantActionResult = {
  success: boolean;
  restaurantId?: string;
  error?: string;
};

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

/**
 * レストラン1件を取得（カテゴリ情報含む）
 */
export async function getRestaurantById(id: string): Promise<RestaurantWithCategories | null> {
  try {
    const result = await db.query.restaurants.findFirst({
      where: eq(restaurants.id, id),
      with: {
        restaurantCategories: {
          with: {
            category: true,
          },
        },
      },
    });

    return result || null;
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    return null;
  }
}

/**
 * 新規レストランを作成
 */
export async function createRestaurant(
  data: Omit<NewRestaurant, "id" | "createdAt" | "updatedAt">,
  categoryIds: string[],
): Promise<RestaurantActionResult> {
  try {
    // バリデーション: カテゴリが最低1つ選択されているか
    if (!categoryIds || categoryIds.length === 0) {
      return {
        success: false,
        error: "カテゴリを最低1つ選択してください",
      };
    }

    // レストランを作成
    const [newRestaurant] = await db
      .insert(restaurants)
      .values({
        ...data,
        isActive: data.isActive ?? true,
      })
      .returning();

    if (!newRestaurant) {
      return {
        success: false,
        error: "レストランの作成に失敗しました",
      };
    }

    // カテゴリとの紐付けを作成
    await db.insert(restaurantCategories).values(
      categoryIds.map((categoryId) => ({
        restaurantId: newRestaurant.id,
        categoryId,
      })),
    );

    // キャッシュを再検証
    revalidatePath("/");

    return {
      success: true,
      restaurantId: newRestaurant.id,
    };
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "レストランの作成中にエラーが発生しました",
    };
  }
}

/**
 * レストラン情報を更新
 */
export async function updateRestaurant(
  id: string,
  data: Omit<NewRestaurant, "id" | "createdAt" | "updatedAt">,
  categoryIds: string[],
): Promise<RestaurantActionResult> {
  try {
    // バリデーション: カテゴリが最低1つ選択されているか
    if (!categoryIds || categoryIds.length === 0) {
      return {
        success: false,
        error: "カテゴリを最低1つ選択してください",
      };
    }

    // レストラン情報を更新
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, id))
      .returning();

    if (!updatedRestaurant) {
      return {
        success: false,
        error: "レストランの更新に失敗しました",
      };
    }

    // 既存のカテゴリ紐付けを削除
    await db.delete(restaurantCategories).where(eq(restaurantCategories.restaurantId, id));

    // 新しいカテゴリ紐付けを作成
    await db.insert(restaurantCategories).values(
      categoryIds.map((categoryId) => ({
        restaurantId: id,
        categoryId,
      })),
    );

    // キャッシュを再検証
    revalidatePath("/");
    revalidatePath(`/restaurants/${id}/edit`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update restaurant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "レストランの更新中にエラーが発生しました",
    };
  }
}

/**
 * レストランの営業状態を切り替え（閉店/営業中）
 */
export async function toggleRestaurantActive(id: string, isActive: boolean): Promise<RestaurantActionResult> {
  try {
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, id))
      .returning();

    if (!updatedRestaurant) {
      return {
        success: false,
        error: "レストランの更新に失敗しました",
      };
    }

    // キャッシュを再検証
    revalidatePath("/");
    revalidatePath("/restaurants/closed");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to toggle restaurant active status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "営業状態の更新中にエラーが発生しました",
    };
  }
}

/**
 * 閉店したレストラン一覧を取得
 */
export async function getClosedRestaurants(): Promise<RestaurantWithCategories[]> {
  try {
    const result = await db.query.restaurants.findMany({
      where: eq(restaurants.isActive, false),
      with: {
        restaurantCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: [desc(restaurants.updatedAt)],
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch closed restaurants:", error);
    return [];
  }
}
