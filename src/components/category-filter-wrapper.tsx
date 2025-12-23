import { getCategories } from "@/app/actions/categories";
import { CategoryFilter } from "@/components/category-filter";

/**
 * カテゴリーフィルターをサーバーサイドで取得して表示するラッパー
 * Suspense境界内で使用することでストリーミング表示を実現
 */
export async function CategoryFilterWrapper() {
  const categories = await getCategories();

  return <CategoryFilter categories={categories} />;
}
