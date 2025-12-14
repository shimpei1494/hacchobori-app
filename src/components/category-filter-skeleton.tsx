import { Skeleton } from "@/components/ui/skeleton";

/**
 * カテゴリーフィルターのスケルトン表示
 */
export function CategoryFilterSkeleton() {
  const skeletonWidths = ["70px", "90px", "100px", "110px", "120px"];

  return (
    <div className="px-4 pb-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* 5個のカテゴリーボタンスケルトンを表示 */}
          {skeletonWidths.map((width) => (
            <Skeleton key={width} className="h-7 rounded-full bg-orange-100 dark:bg-orange-900/30" style={{ width }} />
          ))}
        </div>
      </div>
    </div>
  );
}
