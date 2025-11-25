import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import type { RestaurantWithCategories } from "@/db/schema";
import { restaurants } from "@/db/schema";

/**
 * 全レストランを取得する
 */
export async function getAllRestaurants(): Promise<{
  restaurants: RestaurantWithCategories[];
  count: number;
}> {
  try {
    const results = await db.query.restaurants.findMany({
      where: eq(restaurants.isActive, true),
      with: {
        restaurantCategories: {
          with: {
            category: true,
          },
        },
      },
      limit: 50, // 最大50件
    });

    return {
      restaurants: results,
      count: results.length,
    };
  } catch (error) {
    console.error("Failed to get all restaurants:", error);
    return {
      restaurants: [],
      count: 0,
    };
  }
}
