import { HomePageClient } from "@/components/home-page-client";
import { getCategories, getRestaurants } from "./actions/restaurants";

export default async function HomePage() {
  const [restaurants, categories] = await Promise.all([getRestaurants(), getCategories()]);

  return <HomePageClient initialRestaurants={restaurants} categories={categories} />;
}
