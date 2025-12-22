"use client";

import { MapPin, MoreVertical, Search, Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "@/hooks/use-search-params";

/**
 * ホームページヘッダーの静的コンテンツ部分（ロゴ、検索バー、ユーザーボタンなど）
 * カテゴリーフィルターは含まず、即座に表示される
 */
export function HomePageStaticHeaderContent() {
  const [{ q: searchQuery }, setSearchParams] = useSearchParams();
  const { isAuthenticated, hasCompanyEmail } = useAuth();
  const canAccessAdminFeatures = isAuthenticated && hasCompanyEmail;

  return (
    <>
      {/* メインヘッダー */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* ロゴエリア */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-yellow-800" />
              </div>
            </div>
            {/* タイトル */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                八丁堀ランチ
              </h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>八丁堀エリアのランチ情報</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-icon hover:bg-accent/10 hover:text-icon-active"
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">メニュー</span>
                </Button>
              </DropdownMenuTrigger>
              {canAccessAdminFeatures && (
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/restaurants/closed" className="cursor-pointer">
                      閉店店舗
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/categories" className="cursor-pointer">
                      カテゴリー管理
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 検索エリア */}
      <div className="px-4 pb-3">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon-active w-4 h-4" />
            <Input
              placeholder="お店や料理を検索..."
              value={searchQuery}
              onChange={(e) => setSearchParams({ q: e.target.value })}
              className="pl-10 bg-white/80 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl shadow-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
