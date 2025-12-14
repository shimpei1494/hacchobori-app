import { Suspense } from "react";
import { CategoryFilterSkeleton } from "@/components/category-filter-skeleton";
import { CategoryFilterWrapper } from "@/components/category-filter-wrapper";
import { HomePageStaticHeaderContent } from "@/components/home-page-static-header-content";

/**
 * ホームページのヘッダー（sticky固定）
 * カテゴリーフィルター部分のみSuspense境界でストリーミング表示
 */
export function HomePageHeaderWithSuspense() {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 border-b border-orange-100 dark:border-orange-900/30 shadow-sm">
      {/* 静的ヘッダー部分（ロゴ、検索バー）- クライアントコンポーネント */}
      <HomePageStaticHeaderContent />

      {/* カテゴリーフィルター - Suspense境界内でストリーミング表示 */}
      <Suspense fallback={<CategoryFilterSkeleton />}>
        <CategoryFilterWrapper />
      </Suspense>
    </header>
  );
}
