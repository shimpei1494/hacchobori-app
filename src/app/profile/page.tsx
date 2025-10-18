import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "プロフィール設定 - 八丁堀ランチ",
  description: "ユーザープロフィールの編集",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/");
  }

  // データベースから完全なユーザー情報を取得
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">プロフィール設定</h1>
          <p className="text-muted-foreground mt-2">表示名やメールアドレスなどの情報を編集できます</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
