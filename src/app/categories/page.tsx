import { redirect } from "next/navigation";
import { getCategoriesWithUsage } from "@/app/actions/categories";
import { CategoriesManager } from "@/components/categories-manager";
import { validateAuthWithCompanyEmail } from "@/lib/auth-utils";

// Dynamic Renderingを明示的に有効化
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // 認証チェック: ログイン & 会社アドレス登録済みユーザーのみアクセス可能
  const authResult = await validateAuthWithCompanyEmail();
  if ("error" in authResult) {
    redirect("/");
  }

  // カテゴリー一覧を使用数付きで取得
  const categories = await getCategoriesWithUsage();

  return <CategoriesManager initialCategories={categories} />;
}
