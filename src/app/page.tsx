import { getUserFavoriteIds } from "@/app/actions/favorites";
import { HomePageClient } from "@/components/home-page-client";
import { getCategories, getRestaurants } from "./actions/restaurants";

// Dynamic Renderingを明示的に有効化
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [restaurants, categories, favoriteIds] = await Promise.all([
    getRestaurants(),
    getCategories(),
    getUserFavoriteIds(),
  ]);

  // お気に入り情報を付与
  const restaurantsWithFavoriteStatus = restaurants.map((restaurant) => ({
    ...restaurant,
    isFavorite: favoriteIds.includes(restaurant.id),
  }));

  return <HomePageClient initialRestaurants={restaurantsWithFavoriteStatus} categories={categories} />;
}
