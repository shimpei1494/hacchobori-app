import { eq } from "drizzle-orm";
import { getRestaurants } from "@/app/actions/restaurants";
import { RestaurantList } from "@/components/restaurant-list";
import { db } from "@/db/db";
import { favorites } from "@/db/schema";
import { getServerSession } from "@/lib/auth-utils";

/**
 * レストランリストをサーバーサイドで取得して表示するラッパー
 * Suspense境界内で使用することでストリーミング表示を実現
 */
export async function RestaurantListWrapper() {
  const restaurants = await getRestaurants();

  const session = await getServerSession();

  const favoriteIds = session
    ? (
        await db.query.favorites.findMany({
          where: eq(favorites.userId, session.user.id),
          columns: { restaurantId: true },
        })
      ).map((f) => f.restaurantId)
    : [];

  const restaurantsWithFavoriteStatus = restaurants.map((restaurant) => ({
    ...restaurant,
    isFavorite: favoriteIds.includes(restaurant.id),
  }));

  return <RestaurantList initialRestaurants={restaurantsWithFavoriteStatus} />;
}
