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
import type { Category } from "@/db/schema";
import { useSearchParams } from "@/hooks/use-search-params";

interface HomePageHeaderProps {
  categories: Category[];
}

export function HomePageHeader({ categories }: HomePageHeaderProps) {
  const [{ q: searchQuery, category: selectedCategorySlug }, setSearchParams] = useSearchParams();

  // カテゴリ一覧（「すべて」を先頭に追加）
  const allCategories = [
    { name: "すべて", slug: "all" },
    ...categories.map((cat) => ({ name: cat.name, slug: cat.slug })),
  ];

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 border-b border-orange-100 dark:border-orange-900/30 shadow-sm">
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
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-orange-100 dark:hover:bg-orange-900/30">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">メニュー</span>
                </Button>
              </DropdownMenuTrigger>
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
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 検索・フィルターエリア */}
      <div className="px-4 pb-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
            <Input
              placeholder="お店や料理を検索..."
              value={searchQuery}
              onChange={(e) => setSearchParams({ q: e.target.value })}
              className="pl-10 bg-white/80 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl shadow-sm"
            />
          </div>

          {/* カテゴリーフィルター */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allCategories.map((category) => {
              const isSelected = category.slug === selectedCategorySlug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  className={`whitespace-nowrap cursor-pointer rounded-full px-3 py-1 text-sm font-medium border transition-colors duration-150 ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md shadow-orange-200/50 dark:shadow-orange-900/30"
                      : "bg-white/60 dark:bg-gray-800/50 text-muted-foreground border-orange-200 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 hover:border-orange-300"
                  }`}
                  onClick={() => setSearchParams({ category: category.slug })}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
