import { redirect } from "next/navigation";
import { getCategoriesWithUsage } from "@/app/actions/categories";
import { CategoriesManager } from "@/components/categories-manager";
import { validateAuthWithCompanyEmail } from "@/lib/auth-utils";

// ISRを使用してキャッシュを有効化（編集時はrevalidatePathで更新）
export const revalidate = 604800; // 7日 = 604800秒

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
