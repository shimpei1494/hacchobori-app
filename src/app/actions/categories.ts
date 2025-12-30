"use server";

import { count, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { db } from "@/db/db";
import type { Category } from "@/db/schema";
import { categories, restaurantCategories } from "@/db/schema";
import { validateAuthWithCompanyEmail } from "@/lib/auth-utils";
import { CACHE_TAG } from "@/lib/cache-tags";

/**
 * カテゴリー操作の結果型
 */
export type CategoryActionResult = {
  success: boolean;
  categoryId?: string;
  error?: string;
};

/**
 * カテゴリーと使用数の型
 */
export type CategoryWithUsage = Category & {
  usageCount: number;
};

/**
 * PostgreSQLのユニーク制約違反エラーを解析してユーザーフレンドリーなエラーを返す
 */
function handlePostgresError(error: unknown, defaultMessage: string): CategoryActionResult {
  if (!(error instanceof Error)) {
    return { success: false, error: defaultMessage };
  }

  // biome-ignore lint/suspicious/noExplicitAny: PostgreSQLエラーオブジェクトの型が不明なため
  const wrappedError = error as any;

  // DrizzleがPostgreSQLエラーをラップしているため、causeから取得
  const pgError = wrappedError.cause || wrappedError;

  // ユニーク制約違反のエラーコード: 23505
  if (pgError.code === "23505") {
    const constraintName = pgError.constraint_name || "";

    // 制約名から重複フィールドを特定
    if (constraintName === "categories_name_unique") {
      return {
        success: false,
        error: "このカテゴリー名は既に使用されています",
      };
    }

    if (constraintName === "categories_slug_unique") {
      return {
        success: false,
        error: "この識別名は既に使用されています",
      };
    }

    // どちらか不明な場合
    return {
      success: false,
      error: "同じ名前または識別名のカテゴリーが既に存在します",
    };
  }

  return { success: false, error: defaultMessage };
}

/**
 * カテゴリー一覧を使用数付きで取得
 */
export async function getCategoriesWithUsage(): Promise<CategoryWithUsage[]> {
  "use cache";
  cacheLife("weeks");
  cacheTag(CACHE_TAG.CATEGORIES);

  try {
    // カテゴリーごとにレストランとの紐付け数をカウント
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        displayOrder: categories.displayOrder,
        createdAt: categories.createdAt,
        usageCount: sql<number>`cast(count(${restaurantCategories.restaurantId}) as int)`,
      })
      .from(categories)
      .leftJoin(restaurantCategories, eq(categories.id, restaurantCategories.categoryId))
      .groupBy(categories.id)
      .orderBy(categories.displayOrder);

    return result;
  } catch (error) {
    console.error("Failed to fetch categories with usage:", error);
    return [];
  }
}

/**
 * カテゴリー一覧を取得（displayOrder順）
 */
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("weeks");
  cacheTag(CACHE_TAG.CATEGORIES);

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
 * 新規カテゴリーを作成
 */
export async function createCategory(name: string, slug: string): Promise<CategoryActionResult> {
  try {
    // 認証チェック: ログイン & 会社アドレス登録済みユーザーのみ
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // バリデーション: 名前と識別名が必須
    if (!name?.trim() || !slug?.trim()) {
      return {
        success: false,
        error: "カテゴリー名と識別名は必須です",
      };
    }

    // 既存のカテゴリー数を取得して表示順を決定
    const existingCategories = await db.select({ displayOrder: categories.displayOrder }).from(categories);
    const maxDisplayOrder = existingCategories.reduce((max, cat) => Math.max(max, cat.displayOrder), 0);

    // カテゴリーを作成
    const [newCategory] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        slug: slug.trim(),
        displayOrder: maxDisplayOrder + 1,
      })
      .returning();

    if (!newCategory) {
      return {
        success: false,
        error: "カテゴリーの作成に失敗しました",
      };
    }

    // キャッシュを再検証
    updateTag(CACHE_TAG.CATEGORIES);

    return {
      success: true,
      categoryId: newCategory.id,
    };
  } catch (error) {
    console.error("Failed to create category:", error);
    return handlePostgresError(error, "カテゴリーの作成中にエラーが発生しました");
  }
}

/**
 * カテゴリー情報を更新
 */
export async function updateCategory(id: string, name: string, slug: string): Promise<CategoryActionResult> {
  try {
    // 認証チェック: ログイン & 会社アドレス登録済みユーザーのみ
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // バリデーション: 名前と識別名が必須
    if (!name?.trim() || !slug?.trim()) {
      return {
        success: false,
        error: "カテゴリー名と識別名は必須です",
      };
    }

    // カテゴリー情報を更新
    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: name.trim(),
        slug: slug.trim(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return {
        success: false,
        error: "カテゴリーの更新に失敗しました",
      };
    }

    // キャッシュを再検証
    updateTag(CACHE_TAG.CATEGORIES);

    return {
      success: true,
      categoryId: updatedCategory.id,
    };
  } catch (error) {
    console.error("Failed to update category:", error);
    return handlePostgresError(error, "カテゴリーの更新中にエラーが発生しました");
  }
}

/**
 * カテゴリーの並び順を一括更新
 */
export async function updateCategoryOrder(categoryIds: string[]): Promise<CategoryActionResult> {
  try {
    // 認証チェック: ログイン & 会社アドレス登録済みユーザーのみ
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // 各カテゴリーの displayOrder を一括更新（1回のクエリで実行）
    if (categoryIds.length > 0) {
      // CASE文を使った一括更新（パラメータ化クエリで安全に実行）
      const caseConditions = categoryIds.map(
        (id, index) => sql`WHEN ${categories.id} = ${id} THEN ${sql.raw(index.toString())}`,
      );
      const caseStatement = sql.join(caseConditions, sql.raw(" "));

      await db.execute(sql`
        UPDATE ${categories}
        SET display_order = CASE ${caseStatement} END
        WHERE ${categories.id} IN ${categoryIds}
      `);
    }

    // キャッシュを再検証
    updateTag(CACHE_TAG.CATEGORIES);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update category order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "カテゴリーの並び替え中にエラーが発生しました",
    };
  }
}

/**
 * カテゴリーを削除
 */
export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  try {
    // 認証チェック: ログイン & 会社アドレス登録済みユーザーのみ
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // 使用中かチェック
    const [usageResult] = await db
      .select({ count: count() })
      .from(restaurantCategories)
      .where(eq(restaurantCategories.categoryId, id));

    if (usageResult && usageResult.count > 0) {
      return {
        success: false,
        error: `このカテゴリーは${usageResult.count}件のレストランで使用されているため削除できません`,
      };
    }

    // カテゴリーを削除
    const [deletedCategory] = await db.delete(categories).where(eq(categories.id, id)).returning();

    if (!deletedCategory) {
      return {
        success: false,
        error: "カテゴリーの削除に失敗しました",
      };
    }

    // キャッシュを再検証
    updateTag(CACHE_TAG.CATEGORIES);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "カテゴリーの削除中にエラーが発生しました",
    };
  }
}
