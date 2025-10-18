"use client";

import { useAuthSession } from "@/lib/auth-client";

/**
 * クライアント側で認証状態を取得するカスタムフック
 * ログイン状態、会社アドレス登録状態をチェック
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthSession();

  return {
    user,
    isLoading,
    isAuthenticated,
    hasCompanyEmail: !!user?.companyEmail,
  };
}
