import { Suspense } from "react";
import { HomePageHeader } from "@/components/home-page-header";
import { RestaurantCardsSkeleton } from "@/components/restaurant-cards-skeleton";
import { RestaurantList } from "@/components/restaurant-list";
import { getCategories, getRestaurants } from "./actions/restaurants";

// ISR (Incremental Static Regeneration) を有効化 - 1時間ごとにキャッシュを再検証
export const revalidate = 3600;

export default async function HomePage() {
  // カテゴリとレストランを並列で取得（Promise.allで高速化）
  const [categories, restaurants] = await Promise.all([getCategories(), getRestaurants()]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー・検索・カテゴリフィルターは即座に表示 */}
      <HomePageHeader categories={categories} />

      {/* レストランリスト部分だけSuspenseで遅延ロード */}
      <Suspense fallback={<RestaurantCardsSkeleton />}>
        <RestaurantList initialRestaurants={restaurants} />
      </Suspense>
    </div>
  );
}
