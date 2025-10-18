"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export type UpdateProfileResult = { success: true } | { success: false; error: string };

interface UpdateProfileInput {
  displayName: string | null;
  companyEmail: string | null;
}

export async function updateProfile(data: UpdateProfileInput): Promise<UpdateProfileResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "認証が必要です" };
    }

    const { displayName, companyEmail } = data;

    // ユーザー情報を更新
    await db
      .update(users)
      .set({
        displayName: displayName?.trim() || null,
        companyEmail: companyEmail?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    // キャッシュを再検証
    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "更新に失敗しました" };
  }
}
