"use client";

import { Clock, Edit, ExternalLink, Heart, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { toggleFavorite } from "@/app/actions/favorites";
import { toggleRestaurantActive } from "@/app/actions/restaurants";
import { AuthRequiredDialog } from "@/components/auth/auth-required-dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import type { RestaurantWithFavoriteStatus } from "@/db/schema";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/restaurant-utils";

interface RestaurantCardProps {
  restaurant: RestaurantWithFavoriteStatus;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();
  const { isAuthenticated, hasCompanyEmail } = useAuth();
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogRequireCompanyEmail, setAuthDialogRequireCompanyEmail] = useState(false);

  const handleEditClick = () => {
    // ログイン & 会社アドレス登録チェック
    if (!isAuthenticated || !hasCompanyEmail) {
      setAuthDialogRequireCompanyEmail(!hasCompanyEmail);
      setShowAuthDialog(true);
      return;
    }
    router.push(`/restaurants/${restaurant.id}/edit`);
  };

  const handleToggleFavorite = async () => {
    // ログインチェックのみ（会社アドレス不要）
    if (!isAuthenticated) {
      setAuthDialogRequireCompanyEmail(false);
      setShowAuthDialog(true);
      return;
    }

    // 楽観的UI更新
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    // Server Action呼び出し
    const result = await toggleFavorite(restaurant.id);

    if (!result.success) {
      // エラー時は元に戻す
      setIsFavorite(previousState);
      toast.error(result.error || "お気に入りの更新に失敗しました");
    } else {
      toast.success(result.isFavorite ? "お気に入りに追加しました" : "お気に入りから削除しました");
    }
  };

  const openGoogleMaps = () => {
    if (restaurant.googleMapUrl) {
      window.open(restaurant.googleMapUrl, "_blank");
    } else {
      const query = encodeURIComponent(`${restaurant.name} 東京都八丁堀駅`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  const handleCloseClick = () => {
    // ログイン & 会社アドレス登録チェック
    if (!isAuthenticated || !hasCompanyEmail) {
      setAuthDialogRequireCompanyEmail(!hasCompanyEmail);
      setShowAuthDialog(true);
      return;
    }
    setShowCloseDialog(true);
  };

  const handleCloseRestaurant = async () => {
    setIsClosing(true);
    const result = await toggleRestaurantActive(restaurant.id, false);

    if (result.success) {
      toast.success(`${restaurant.name}を閉店にしました`, {
        description: "閉店店舗ページから復活できます",
      });
      setShowCloseDialog(false);
    } else {
      toast.error(result.error || "閉店処理に失敗しました");
    }
    setIsClosing(false);
  };

  // ビュー層でデータを加工
  const price = formatPrice(restaurant.priceMin, restaurant.priceMax);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-orange-200 dark:hover:border-orange-800/30">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {restaurant.restaurantCategories.map((rc) => (
                <Badge
                  key={rc.category.id}
                  variant="outline"
                  className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/40 font-medium"
                >
                  {rc.category.name}
                </Badge>
              ))}
            </div>
            <h3 className="font-semibold text-lg text-balance">{restaurant.name}</h3>
          </div>
          {/* アクションボタン（編集・閉店・お気に入り） */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleCloseClick}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isFavorite ? "text-orange-500" : ""}`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-orange-500 text-orange-500" : "text-gray-600"}`} />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3 text-pretty">{restaurant.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {restaurant.distance && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.distance}</span>
              </div>
            )}
            <span className="font-medium text-orange-600 dark:text-orange-400">{price}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openGoogleMaps}
              className="flex-1 bg-transparent border-orange-200 dark:border-orange-800/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300"
            >
              <MapPin className="w-4 h-4 mr-1" />
              地図で見る
            </Button>

            {restaurant.tabelogUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(restaurant.tabelogUrl ?? "", "_blank")}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                食べログ
              </Button>
            )}

            {restaurant.websiteUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(restaurant.websiteUrl ?? "", "_blank")}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                HP
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* 閉店確認ダイアログ */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{restaurant.name}を閉店にしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この店舗は一覧に表示されなくなります。
              <br />
              後で「閉店店舗」ページから営業中に戻すこともできます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosing}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseRestaurant} disabled={isClosing}>
              {isClosing ? "処理中..." : "閉店にする"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 認証要求ダイアログ */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        isAuthenticated={isAuthenticated}
        requireCompanyEmail={authDialogRequireCompanyEmail}
      />
    </Card>
  );
}
