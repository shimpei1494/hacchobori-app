import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, User } from "./auth";
import { auth } from "./auth";

export interface AuthSession {
  user: User;
  session: Session;
}

/**
 * Get the current session from the server
 * Returns null if no session exists
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      user: session.user as User,
      session: session.session as Session,
    };
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}

/**
 * Require authentication for a page
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Require no authentication for a page
 * Redirects to dashboard if authenticated
 */
export async function requireNoAuth(): Promise<void> {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
}

/**
 * Get user ID from session
 * Returns null if no session exists
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user.id || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

/**
 * Require company email registration
 * Redirects to profile page if company email is not set
 */
export async function requireCompanyEmail(): Promise<AuthSession> {
  const session = await requireAuth();

  if (!session.user.companyEmail) {
    redirect("/profile?requireCompanyEmail=true");
  }

  return session;
}

/**
 * Server Action用: 認証チェック（ログインのみ）
 * リダイレクトせず、エラーオブジェクトを返す
 *
 * @example
 * const authResult = await validateAuth();
 * if ('error' in authResult) {
 *   return { success: false, error: authResult.error };
 * }
 * const { session } = authResult;
 */
export async function validateAuth(): Promise<{ session: AuthSession } | { error: string }> {
  const session = await getServerSession();

  if (!session) {
    return { error: "ログインが必要です" };
  }

  return { session };
}

/**
 * Server Action用: 認証チェック（ログイン + 会社アドレス）
 * リダイレクトせず、エラーオブジェクトを返す
 *
 * @example
 * const authResult = await validateAuthWithCompanyEmail();
 * if ('error' in authResult) {
 *   return { success: false, error: authResult.error };
 * }
 * const { session } = authResult;
 */
export async function validateAuthWithCompanyEmail(): Promise<{ session: AuthSession } | { error: string }> {
  const session = await getServerSession();

  if (!session) {
    return { error: "ログインが必要です" };
  }

  if (!session.user.companyEmail) {
    return { error: "会社用メールアドレスの登録が必要です" };
  }

  return { session };
}

/**
 * Validate session middleware helper
 */
export async function validateSession(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return {
      isValid: !!session?.user,
      user: session?.user || null,
      session: session?.session || null,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return {
      isValid: false,
      user: null,
      session: null,
    };
  }
}
