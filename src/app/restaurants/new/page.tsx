import { getCategories } from "@/app/actions/restaurants";
import { RestaurantForm } from "@/components/restaurant-form";

export default async function NewRestaurantPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">レストランを追加</h1>
        <p className="text-muted-foreground mt-2">新しいレストラン情報を入力してください</p>
      </div>

      <RestaurantForm categories={categories} />
    </div>
  );
}
