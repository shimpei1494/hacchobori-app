"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfile } from "@/app/profile/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/db/schema";
import { useAuthSession } from "@/lib/auth-client";
import { type ProfileFormData, profileFormSchema } from "@/lib/validations/profile";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { refetch } = useAuthSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user.displayName || "",
      companyEmail: user.companyEmail || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      const result = await updateProfile({
        displayName: data.displayName || null,
        companyEmail: data.companyEmail || null,
      });

      if (result.success) {
        toast.success("プロフィールを更新しました");
        // Better Authのセッションキャッシュを更新
        await refetch();
        // ページキャッシュも更新
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedName = user.displayName || user.name || "ゲスト";
  const userInitial = displayedName[0]?.toUpperCase() || "U";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* プロフィール画像セクション */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール画像</CardTitle>
          <CardDescription>Googleアカウントの画像が使用されます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {user.image ? (
                <>
                  {imageLoading && <Skeleton className="h-20 w-20 rounded-full" />}
                  <AvatarImage
                    src={user.image}
                    alt="プロフィール画像"
                    onLoad={() => setImageLoading(false)}
                    className={imageLoading ? "opacity-0" : "opacity-100"}
                  />
                </>
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{userInitial}</AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                画像を変更するにはGoogleアカウントの設定を変更してください。
                <br />
                変更後、反映まで最大1日程度かかる場合があります。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本情報セクション */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>表示名やメールアドレスを設定できます</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google認証情報（読み取り専用） */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-email`} className="text-muted-foreground">
              Googleアカウント
            </Label>
            <Input id={`${formId}-email`} type="email" value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">このアカウントでログインしています</p>
          </div>

          {/* 編集可能フィールド */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-displayName`}>
                表示名 <span className="text-xs text-muted-foreground">（任意）</span>
              </Label>
              <Input id={`${formId}-displayName`} {...register("displayName")} placeholder={user.name} maxLength={20} />
              {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
              <p className="text-xs text-muted-foreground">設定すると、アプリ内でこの名前が優先的に表示されます</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-companyEmail`}>
                会社用メールアドレス <span className="text-xs text-muted-foreground">（任意）</span>
              </Label>
              <Input
                id={`${formId}-companyEmail`}
                type="email"
                {...register("companyEmail")}
                placeholder="example@company.com"
              />
              {errors.companyEmail && <p className="text-sm text-destructive">{errors.companyEmail.message}</p>}
              <p className="text-xs text-muted-foreground">会社用のメールアドレスを登録できます</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存する"}
        </Button>
      </div>
    </form>
  );
}
