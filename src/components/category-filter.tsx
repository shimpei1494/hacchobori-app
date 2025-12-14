"use client";

import type { Category } from "@/db/schema";
import { useSearchParams } from "@/hooks/use-search-params";

interface CategoryFilterProps {
  categories: Category[];
}

/**
 * カテゴリーフィルターコンポーネント（データ駆動）
 */
export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [{ category: selectedCategorySlug }, setSearchParams] = useSearchParams();

  // カテゴリ一覧（「すべて」を先頭に追加）
  const allCategories = [
    { name: "すべて", slug: "all" },
    ...categories.map((cat) => ({ name: cat.name, slug: cat.slug })),
  ];

  return (
    <div className="px-4 pb-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allCategories.map((category) => {
            const isSelected = category.slug === selectedCategorySlug;
            return (
              <button
                key={category.slug}
                type="button"
                className={`whitespace-nowrap cursor-pointer rounded-full px-3 py-1 text-sm font-medium border transition-colors duration-150 ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md shadow-orange-200/50 dark:shadow-orange-900/30"
                    : "bg-white/60 dark:bg-gray-800/50 text-muted-foreground border-orange-200 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 hover:border-orange-300"
                }`}
                onClick={() => setSearchParams({ category: category.slug })}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
