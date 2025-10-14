import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getClosedRestaurants, getRestaurants } from "@/app/actions/restaurants";
import { ClosedRestaurantCard } from "@/components/closed-restaurant-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ClosedRestaurantsPage() {
  const [closedRestaurants, activeRestaurants] = await Promise.all([getClosedRestaurants(), getRestaurants()]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-1" />
            一覧に戻る
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">閉店店舗の管理</h1>
        <p className="text-muted-foreground mt-2">
          閉店にした店舗の一覧です。誤操作の場合は営業中に戻すことができます。
        </p>
      </div>

      {/* 統計情報 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">閉店店舗</p>
              <p className="text-3xl font-bold text-destructive">{closedRestaurants.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">営業中</p>
              <p className="text-3xl font-bold text-primary">{activeRestaurants.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 閉店店舗リスト */}
      <div className="space-y-4">
        {closedRestaurants.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">閉店した店舗はありません</p>
          </Card>
        ) : (
          closedRestaurants.map((restaurant) => <ClosedRestaurantCard key={restaurant.id} restaurant={restaurant} />)
        )}
      </div>
    </div>
  );
}
