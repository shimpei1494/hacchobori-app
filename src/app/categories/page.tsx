import { getCategoriesWithUsage } from "@/app/actions/categories";
import { CategoriesManager } from "@/components/categories-manager";

/**
 * カテゴリー管理ページ
 */
export default async function CategoriesPage() {
  const categories = await getCategoriesWithUsage();
  return <CategoriesManager initialCategories={categories} />;
}
