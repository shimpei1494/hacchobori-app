"use client";

import { LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signInWithGoogle, signOutWithToast, useAuthSession } from "@/lib/auth-client";

export function UserMenu() {
  const { user, isLoading, isAuthenticated } = useAuthSession();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <User className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" onClick={signInWithGoogle}>
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">ログイン</span>
      </Button>
    );
  }

  // ユーザー名の頭文字を取得（アバターのフォールバック用）
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-muted-foreground text-xs">
          お気に入り機能（準備中）
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOutWithToast} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
