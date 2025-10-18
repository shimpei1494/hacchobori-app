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

export function UserButton() {
  const { user, isLoading, isAuthenticated } = useAuthSession();

  // ローディング中はスケルトンを表示
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-border animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button onClick={signInWithGoogle} variant="outline" size="sm" className="gap-2">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">ログイン</span>
      </Button>
    );
  }

  const displayedName = user.displayName || user.name || "ゲスト";
  const userInitial = displayedName[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} alt={displayedName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayedName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
          <User className="mr-2 h-4 w-4" />
          <span>マイページ（準備中）</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOutWithToast} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
