import { getRestaurants } from "@/app/actions/restaurants";
import { RestaurantList } from "@/components/restaurant-list";

/**
 * レストランリストをサーバーサイドで取得して表示するラッパー
 * Suspense境界内で使用することでストリーミング表示を実現
 */
export async function RestaurantListWrapper() {
  const restaurants = await getRestaurants();

  return <RestaurantList initialRestaurants={restaurants} />;
}
