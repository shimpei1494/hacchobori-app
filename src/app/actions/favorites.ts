"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { favorites } from "@/db/schema";
import { auth } from "@/lib/auth";

/**
 * お気に入り操作の結果型
 */
export type FavoriteActionResult = {
  success: boolean;
  isFavorite?: boolean;
  error?: string;
};

/**
 * お気に入りのトグル（追加/削除）
 */
export async function toggleFavorite(restaurantId: string): Promise<FavoriteActionResult> {
  try {
    // 認証チェック: ログインユーザーのみ（会社メール不要）
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "お気に入り機能を利用するにはログインが必要です",
      };
    }

    const userId = session.user.id;

    // 既存のお気に入りをチェック
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(eq(favorites.userId, userId), eq(favorites.restaurantId, restaurantId)),
    });

    if (existingFavorite) {
      // お気に入りから削除
      await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.restaurantId, restaurantId)));

      revalidatePath("/");

      return {
        success: true,
        isFavorite: false,
      };
    }

    // お気に入りに追加
    await db.insert(favorites).values({
      userId,
      restaurantId,
    });

    revalidatePath("/");

    return {
      success: true,
      isFavorite: true,
    };
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "お気に入りの操作中にエラーが発生しました",
    };
  }
}

/**
 * ログインユーザーのお気に入りレストランIDリストを取得
 */
export async function getUserFavoriteIds(): Promise<string[]> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return [];
    }

    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, session.user.id),
      columns: {
        restaurantId: true,
      },
    });

    return userFavorites.map((f) => f.restaurantId);
  } catch (error) {
    console.error("Failed to fetch user favorites:", error);
    return [];
  }
}
