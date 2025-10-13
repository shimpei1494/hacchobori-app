"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import type { Category, NewRestaurant, RestaurantWithCategories } from "@/db/schema";
import { categories, restaurantCategories, restaurants } from "@/db/schema";

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
 * 新規レストランを作成
 */
export async function createRestaurant(
  data: Omit<NewRestaurant, "id" | "createdAt" | "updatedAt">,
  categoryIds: string[],
): Promise<{ success: boolean; restaurantId?: string; error?: string }> {
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
