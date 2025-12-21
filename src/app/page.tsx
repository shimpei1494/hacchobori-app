import { Suspense } from "react";
import { HomePageHeaderWithSuspense } from "@/components/home-page-header-with-suspense";
import { RestaurantCardsSkeleton } from "@/components/restaurant-cards-skeleton";
import { RestaurantListWrapper } from "@/components/restaurant-list-wrapper";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー（sticky固定）- カテゴリー部分のみSuspense境界内でストリーミング表示 */}
      <HomePageHeaderWithSuspense />

      {/* レストランリスト - Suspense境界内でデータ取得してストリーミング表示 */}
      <Suspense fallback={<RestaurantCardsSkeleton />}>
        <RestaurantListWrapper />
      </Suspense>
    </div>
  );
}
