"use client";

import { Edit, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRestaurantPermanently, toggleRestaurantActive } from "@/app/actions/restaurants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteRestaurantPermanently(restaurant.id);

    if (result.success) {
      toast.success(`${restaurant.name}を完全に削除しました`);
      setIsDeleteDialogOpen(false);
    } else {
      toast.error(result.error || "削除に失敗しました");
      setIsDeleting(false);
    }
  };

  const primaryCategory = getPrimaryCategory(restaurant);

  return (
    <>
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
            <Button variant="destructive" onClick={handleDeleteClick} disabled={isRestoring || isDeleting}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ 完全削除の確認</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>このレストランを完全に削除しますか？</p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-semibold text-foreground">{restaurant.name}</p>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">この操作は取り消せません。</p>
                  <p>以下のデータもすべて削除されます：</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>カテゴリ情報</li>
                    <li>お気に入り登録</li>
                    <li>閉店履歴</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "削除中..." : "完全削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
