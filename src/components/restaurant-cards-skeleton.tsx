export function RestaurantCardsSkeleton() {
  return (
    <main className="px-4 py-6 max-w-7xl mx-auto">
      <div>
        {/* セクションヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full" />
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-6 w-12 bg-orange-50 dark:bg-orange-900/20 rounded-full animate-pulse" />
        </div>

        {/* レストランカードスケルトン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* カード上部 */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* カテゴリバッジ */}
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded animate-pulse" />
                      <div className="h-6 w-16 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded animate-pulse" />
                    </div>
                    {/* レストラン名 */}
                    <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  {/* アクションボタン */}
                  <div className="flex items-center gap-1">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* カード本体 */}
              <div className="p-4 space-y-3">
                {/* 説明文 */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>

                {/* 距離と価格 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>

                {/* ボタンエリア */}
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-800 border border-orange-200 dark:border-orange-800/30 rounded animate-pulse" />
                  <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-800 border border-orange-200 dark:border-orange-800/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
