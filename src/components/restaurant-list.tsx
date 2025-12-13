"use client";

import { useEffect, useState } from "react";
import { getUserFavoriteIds } from "@/app/actions/favorites";
import { BottomNavigation } from "@/components/bottom-navigation";
import { RestaurantCard } from "@/components/restaurant-card";
import { Card } from "@/components/ui/card";
import type { RestaurantWithCategories } from "@/db/schema";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "@/hooks/use-search-params";
import { getPrimaryCategory } from "@/lib/restaurant-utils";

interface RestaurantListProps {
  initialRestaurants: RestaurantWithCategories[];
}

export function RestaurantList({ initialRestaurants }: RestaurantListProps) {
  const [{ q: searchQuery, category: selectedCategorySlug, favorite: showFavoriteOnly }] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("discover");

  // クライアント側でお気に入りデータを取得
  useEffect(() => {
    async function loadFavorites() {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }

      try {
        const ids = await getUserFavoriteIds();
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    }

    loadFavorites();
  }, [isAuthenticated]);

  // レストランにお気に入り情報を付与
  const restaurantsWithFavoriteStatus = initialRestaurants.map((restaurant) => ({
    ...restaurant,
    isFavorite: favoriteIds.includes(restaurant.id),
  }));

  const filteredRestaurants = restaurantsWithFavoriteStatus.filter((restaurant) => {
    const primaryCategory = getPrimaryCategory(restaurant);

    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      primaryCategory.toLowerCase().includes(searchQuery.toLowerCase());

    // slugベースでフィルタリング
    const matchesCategory =
      selectedCategorySlug === "all" ||
      restaurant.restaurantCategories.some((rc) => rc.category.slug === selectedCategorySlug);

    // お気に入りフィルタ
    const matchesFavorite = showFavoriteOnly === "true" ? restaurant.isFavorite : true;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <>
      <main className="px-4 py-6 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full" />
              <h2 className="text-lg font-semibold">おすすめのお店</h2>
            </div>
            <span className="text-sm text-muted-foreground bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
              {filteredRestaurants.length}件
            </span>
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
    </>
  );
}
