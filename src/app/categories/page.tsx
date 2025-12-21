import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCategoriesWithUsage } from "@/app/actions/categories";
import { CategoriesManager } from "@/components/categories-manager";
import { validateAuthWithCompanyEmail } from "@/lib/auth-utils";

// キャッシュ可能なコンポーネント
async function CachedCategoriesContent() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  const categories = await getCategoriesWithUsage();
  return <CategoriesManager initialCategories={categories} />;
}

export default async function CategoriesPage() {
  // 認証チェック（動的、キャッシュ外）
  const authResult = await validateAuthWithCompanyEmail();
  if ("error" in authResult) {
    redirect("/");
  }

  // カテゴリーデータは全ユーザー共通なので引数不要
  return <CachedCategoriesContent />;
}
