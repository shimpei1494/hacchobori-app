import { HomePageClient } from "@/components/home-page-client";
import { getRestaurants, getCategories } from "./actions/restaurants";

export default async function HomePage() {
	const [restaurants, categories] = await Promise.all([
		getRestaurants(),
		getCategories(),
	]);

	return (
		<HomePageClient initialRestaurants={restaurants} categories={categories} />
	);
}
