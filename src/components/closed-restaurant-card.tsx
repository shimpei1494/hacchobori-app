"use client";

import { Edit, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { toggleRestaurantActive } from "@/app/actions/restaurants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { RestaurantWithCategories } from "@/db/schema";
import { getPrimaryCategory } from "@/lib/restaurant-utils";

interface ClosedRestaurantCardProps {
  restaurant: RestaurantWithCategories;
}

export function ClosedRestaurantCard({ restaurant }: ClosedRestaurantCardProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    const result = await toggleRestaurantActive(restaurant.id, true);

    if (result.success) {
      toast.success(`${restaurant.name}を営業中に戻しました`);
    } else {
      toast.error(result.error || "復活処理に失敗しました");
      setIsRestoring(false);
    }
  };

  const primaryCategory = getPrimaryCategory(restaurant);

  return (
    <Card className="opacity-80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive">閉店</Badge>
              <Badge variant="outline">{primaryCategory}</Badge>
            </div>
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {restaurant.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{restaurant.description}</p>
        )}
        <div className="flex gap-2">
          <Button variant="default" className="flex-1" onClick={handleRestore} disabled={isRestoring}>
            <RotateCcw className="w-4 h-4 mr-1" />
            {isRestoring ? "復活中..." : "営業中に戻す"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/restaurants/${restaurant.id}/edit`} prefetch={false}>
              <Edit className="w-4 h-4 mr-1" />
              編集
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
