"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signInWithGoogle } from "@/lib/auth-client";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  requireCompanyEmail?: boolean;
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
  isAuthenticated,
  requireCompanyEmail = false,
}: AuthRequiredDialogProps) {
  // 未ログイン時
  if (!isAuthenticated) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDialogTitle>ログインが必要です</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              この機能を利用するには、ログインが必要です。
              <br />
              Googleアカウントでログインしてください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={signInWithGoogle}>ログインする</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // ログイン済みだが会社アドレス未登録時
  if (requireCompanyEmail) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDialogTitle>会社アドレスの登録が必要です</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              レストランの追加・編集には、会社用メールアドレスの登録が必要です。
              <br />
              プロフィール設定ページで登録してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/profile?requireCompanyEmail=true">プロフィール設定</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}
