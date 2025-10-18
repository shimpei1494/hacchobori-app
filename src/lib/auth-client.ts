"use client";

import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import type { User } from "@/db/schema";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [],
});

// Export hooks and methods for easier use
export const { signIn, signOut, signUp, useSession, getSession, updateUser, changeEmail } = authClient;

// Wrapper functions with toast notifications
export const signInWithGoogle = async () => {
  try {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  } catch (error) {
    console.error("Google sign in error:", error);
    toast.error("Failed to sign in with Google");
  }
};

export const signOutWithToast = async () => {
  try {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          window.location.href = "/";
        },
        onError: (ctx) => {
          console.error("Sign out error:", ctx.error);
          toast.error("Failed to sign out");
        },
      },
    });
  } catch (error) {
    console.error("Sign out error:", error);
    toast.error("Failed to sign out");
  }
};

// Session hook with loading state
export function useAuthSession() {
  const session = useSession();

  return {
    user: (session.data?.user as User | undefined) || null,
    session: session.data?.session || null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    error: session.error,
    refetch: session.refetch, // セッション再取得関数を公開
  };
}

// セッションを再取得してキャッシュを更新
export async function refreshSession() {
  try {
    await getSession();
  } catch (error) {
    console.error("Session refresh error:", error);
  }
}
