# キャッシュ戦略ガイド

Next.js 16 Cache Componentsを使用したシンプルで一貫性のあるキャッシュ戦略。

## 基本原則

1. **シンプルさ優先**: YAGNI - 必要になるまで複雑な最適化はしない
2. **定数化**: 全キャッシュタグは `src/lib/cache-tags.ts` で一元管理
3. **直接呼び出し**: ヘルパー関数不要、`updateTag()` を直接使用
4. **粗粒度**: リソース全体でタグ付け、ID単位は避ける

```typescript
// ✅ 正しい
import { CACHE_TAG } from "@/lib/cache-tags";
cacheTag(CACHE_TAG.RESTAURANTS);
updateTag(CACHE_TAG.RESTAURANTS);

// ❌ 間違い
cacheTag("restaurants");  // typo可能性
updateTag("restaurant-123");  // 過度な細粒度化
revalidateOnRestaurantCreate();  // 不要な抽象化
```

## 読み取り操作（GET）

### use cache 使用条件（全て満たす必要あり）

1. 全ユーザー共通データ
2. ランタイムAPI未使用（`headers()`, `cookies()`, `draftMode()`）
3. 変更頻度が低い（週単位）

### テンプレート

```typescript
export async function getRestaurants(): Promise<RestaurantWithCategories[]> {
  "use cache";
  cacheLife("weeks");
  cacheTag(CACHE_TAG.RESTAURANTS);

  try {
    return await db.query.restaurants.findMany({...});
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return [];
  }
}
```

### キャッシュ不可の例

```typescript
// ❌ headers()使用 & ユーザー固有データ
export async function getUserFavoriteIds(): Promise<string[]> {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });
  // ...
}
```

## 更新操作（CREATE/UPDATE/DELETE）

### updateTag vs revalidateTag

Server Actionsでは `updateTag()` を使用（read-your-own-writes対応）：

- **updateTag**: 即座に無効化、次リクエストで新データ待機
- **revalidateTag**: stale-while-revalidate（古データ返却しつつBG更新）

### テンプレート

```typescript
export async function createRestaurant(
  data: Omit<NewRestaurant, "id" | "createdAt" | "updatedAt">,
  categoryIds: string[],
): Promise<RestaurantActionResult> {
  try {
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) {
      return { success: false, error: authResult.error };
    }

    const [newRestaurant] = await db.insert(restaurants).values({...}).returning();
    await db.insert(restaurantCategories).values(...);

    updateTag(CACHE_TAG.RESTAURANTS);  // ✅ 直接呼び出し

    return { success: true, restaurantId: newRestaurant.id };
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    return { success: false, error: "レストランの作成中にエラーが発生しました" };
  }
}
```

## タグ粒度とスコープ

### 粒度設計

```typescript
export const CACHE_TAG = {
  RESTAURANTS: "restaurants",  // 全レストラン
  CATEGORIES: "categories",     // 全カテゴリ
} as const;

// ❌ ID単位のタグは避ける
cacheTag(`restaurant-${id}`);  // 過度な細粒度化
```

**理由**: プロジェクト規模（数十〜数百件）では全体無効化で十分高速。実装コスト > パフォーマンス改善効果。

### 影響範囲

```typescript
// レストラン更新
updateTag(CACHE_TAG.RESTAURANTS);
// → getRestaurants(), getRestaurantById(*), getClosedRestaurants() 全て無効化
// 問題なし: 更新頻度低い、次回アクセスで再キャッシュ

// カテゴリ更新
updateTag(CACHE_TAG.CATEGORIES);
// → getCategories(), getCategoriesWithUsage() のみ無効化
// レストランキャッシュは影響なし
```

## 新規リソース追加手順

```typescript
// 1. cache-tags.ts にタグ追加
export const CACHE_TAG = {
  RESTAURANTS: "restaurants",
  CATEGORIES: "categories",
  REVIEWS: "reviews",  // ← 追加
} as const;

// 2. GET関数にキャッシュ設定
export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("weeks");
  cacheTag(CACHE_TAG.REVIEWS);
  try {
    return await db.query.reviews.findMany({...});
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

// 3. 更新関数にupdateTag
export async function createReview(data: NewReview): Promise<ReviewActionResult> {
  try {
    const authResult = await validateAuthWithCompanyEmail();
    if ("error" in authResult) return { success: false, error: authResult.error };

    const [newReview] = await db.insert(reviews).values(data).returning();
    if (!newReview) return { success: false, error: "作成失敗" };

    updateTag(CACHE_TAG.REVIEWS);
    return { success: true, reviewId: newReview.id };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "作成中エラー" };
  }
}
```

## チェックリスト

**GET操作**:
- [ ] 全ユーザー共通データ
- [ ] ランタイムAPI未使用（`headers()`, `cookies()`等）
- [ ] 変更頻度低い（週単位）
- [ ] → `"use cache"` + `cacheLife("weeks")` + `cacheTag(CACHE_TAG.XXX)`

**更新操作**:
- [ ] 認証チェック実装済み
- [ ] DB操作成功確認
- [ ] `updateTag(CACHE_TAG.XXX)` 呼び出し
- [ ] エラーハンドリング実装

**タグ管理**:
- [ ] `cache-tags.ts` に定数追加
- [ ] 文字列リテラル使用していない
- [ ] ID単位タグ作成していない

## デバッグ

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
# Cache HIT/MISS/Invalidated を確認
```
