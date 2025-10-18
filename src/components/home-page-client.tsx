"use client";

import { MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@/components/auth/user-button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { RestaurantCard } from "@/components/restaurant-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Category, RestaurantWithCategories } from "@/db/schema";
import { getCategoryNames, getPrimaryCategory } from "@/lib/restaurant-utils";

interface HomePageClientProps {
  initialRestaurants: RestaurantWithCategories[];
  categories: Category[];
}

export function HomePageClient({ initialRestaurants, categories }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");

  const filteredRestaurants = initialRestaurants.filter((restaurant) => {
    const primaryCategory = getPrimaryCategory(restaurant);
    const categoryNames = getCategoryNames(restaurant);

    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      primaryCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "すべて" || categoryNames.some((cat) => cat === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // カテゴリ一覧（「すべて」を先頭に追加）
  const allCategories = ["すべて", ...categories.map((cat) => cat.name)];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">🍱 八丁堀ランチ</h1>
              <p className="text-sm text-muted-foreground">美味しいランチを見つけよう</p>
            </div>
            <div className="flex items-center gap-3">
              <UserButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* 検索・フィルターエリア */}
      <div className="sticky top-[73px] z-10 bg-background border-b border-border">
        <div className="px-4 py-3 max-w-7xl mx-auto">
          {/* 検索バー */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="レストランや料理を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>

          {/* カテゴリーフィルター */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={`whitespace-nowrap cursor-pointer transition-colors ${
                  category === selectedCategory
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="px-4 py-6 max-w-7xl mx-auto">
        {/* レストランリスト */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">おすすめのお店</h2>
            <span className="text-sm text-muted-foreground">{filteredRestaurants.length}件見つかりました</span>
          </div>

          {filteredRestaurants.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">該当するレストランが見つかりませんでした</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ボトムナビゲーション */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
