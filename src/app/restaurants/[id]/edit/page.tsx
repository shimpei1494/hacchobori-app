import { notFound } from "next/navigation";
import { getCategories } from "@/app/actions/categories";
import { getRestaurantById } from "@/app/actions/restaurants";
import { RestaurantForm } from "@/components/restaurant-form";

interface EditRestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { id } = await params;
  const [restaurant, categories] = await Promise.all([getRestaurantById(id), getCategories()]);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">レストラン情報を編集</h1>
        <p className="text-muted-foreground mt-2">{restaurant.name} の情報を更新します</p>
      </div>

      <RestaurantForm categories={categories} initialData={restaurant} mode="edit" />
    </div>
  );
}
