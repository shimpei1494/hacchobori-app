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
      user: session.user,
      session: session.session,
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
