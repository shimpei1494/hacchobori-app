import { cacheLife, cacheTag } from "next/cache";
import { getCategoriesWithUsage } from "@/app/actions/categories";
import { CategoriesManager } from "@/components/categories-manager";

/**
 * カテゴリー管理ページ
 */
export default async function CategoriesPage() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  const categories = await getCategoriesWithUsage();
  return <CategoriesManager initialCategories={categories} />;
}
