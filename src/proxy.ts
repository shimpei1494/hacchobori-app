/**
 * Next.js 16 Proxy
 * 認証が必要なページへのアクセスを制御
 *
 * matcher: Proxy関数をいつ実行するかを制御（パフォーマンス最適化）
 * proxy関数: 実際の認証チェックロジック
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // matcherで既にフィルタリングされているので、
  // このパスに到達した時点で認証が必要なページ

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // 認証されていない場合はリダイレクト
    if (!session?.user) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }

    // companyEmailチェック（会社メールアドレス登録が必須）
    const user = session.user as { companyEmail?: string };
    if (!user.companyEmail) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Proxy authentication check failed:", error);
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // 認証成功 - ページレンダリングへ進む
  return NextResponse.next();
}

/**
 * 認証が必要なページのパスパターン
 * このmatcherで指定したパスのみproxy関数が実行される
 */
export const config = {
  matcher: [
    "/categories",      // カテゴリー管理
    "/restaurants/new",         // レストラン追加
    "/restaurants/:id/edit",    // レストラン編集
    "/ai-chat",                 // AIチャット
  ],
};
