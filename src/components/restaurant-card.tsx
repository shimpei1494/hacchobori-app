"use client";

import { useState } from "react";
import { Star, Heart, Clock, ExternalLink, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RestaurantWithCategories } from "@/db/schema";
import {
	formatPrice,
	getPrimaryCategory,
	getTags,
	parseRating,
} from "@/lib/restaurant-utils";

interface RestaurantCardProps {
	restaurant: RestaurantWithCategories;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
	const [isFavorite, setIsFavorite] = useState(false); // TODO: ユーザー認証実装後に対応

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	const openGoogleMaps = () => {
		const query = encodeURIComponent(
			`${restaurant.name} ${restaurant.address}`,
		);
		window.open(
			`https://www.google.com/maps/search/?api=1&query=${query}`,
			"_blank",
		);
	};

	// ビュー層でデータを加工
	const primaryCategory = getPrimaryCategory(restaurant);
	const price = formatPrice(restaurant.priceMin, restaurant.priceMax);
	const tags = getTags(restaurant);
	const rating = parseRating(restaurant.rating);

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<Badge className="bg-primary">{primaryCategory}</Badge>
							{rating && (
								<div className="flex items-center gap-1 text-sm">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{rating}</span>
								</div>
							)}
						</div>
						<h3 className="font-semibold text-lg text-balance">
							{restaurant.name}
						</h3>
					</div>
					<Button variant="ghost" size="icon" onClick={toggleFavorite}>
						<Heart
							className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
						/>
					</Button>
				</div>
			</div>

			<CardContent className="p-4">
				<p className="text-sm text-muted-foreground mb-3 text-pretty">
					{restaurant.description}
				</p>

				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						{restaurant.distance && (
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								<span>{restaurant.distance}</span>
							</div>
						)}
						<span className="font-medium text-primary">{price}</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-1 mb-4">
					{tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={openGoogleMaps}
						className="flex-1 bg-transparent"
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
			</CardContent>
		</Card>
	);
}
