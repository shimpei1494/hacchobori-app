"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useId } from "react";
import { toast } from "sonner";
import {
	Store,
	Star,
	DollarSign,
	MapPin,
	Navigation,
	Globe,
	Image as ImageIcon,
	FileText,
	Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { createRestaurant } from "@/app/actions/restaurants";
import {
	restaurantFormSchema,
	type RestaurantFormData,
} from "@/lib/validations/restaurant";
import type { Category } from "@/db/schema";

interface RestaurantFormProps {
	categories: Category[];
}

export function RestaurantForm({ categories }: RestaurantFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Generate unique ID prefix for all form fields
	const formId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<RestaurantFormData>({
		resolver: zodResolver(restaurantFormSchema),
		defaultValues: {
			categoryIds: [],
			isActive: true,
		},
	});

	const selectedCategories = watch("categoryIds");

	const handleCategoryToggle = (categoryId: string) => {
		const current = selectedCategories || [];
		const updated = current.includes(categoryId)
			? current.filter((id) => id !== categoryId)
			: [...current, categoryId];
		setValue("categoryIds", updated);
	};

	const onSubmit = async (data: RestaurantFormData) => {
		try {
			setIsSubmitting(true);

			const restaurantData = {
				name: data.name,
				rating: data.rating ? data.rating : null,
				priceMin: data.priceMin ? Number.parseInt(data.priceMin, 10) : null,
				priceMax: data.priceMax ? Number.parseInt(data.priceMax, 10) : null,
				distance: data.distance || null,
				address: data.address || null,
				tabelogUrl: data.tabelogUrl || null,
				websiteUrl: data.websiteUrl || null,
				description: data.description || null,
				imageUrl: data.imageUrl || null,
				isActive: data.isActive,
			};

			const result = await createRestaurant(restaurantData, data.categoryIds);

			if (result.success) {
				toast.success("レストランを追加しました");
				router.push("/");
				router.refresh();
			} else {
				toast.error(result.error || "エラーが発生しました");
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("送信中にエラーが発生しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* 基本情報 */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Store className="h-5 w-5 text-primary" />
						<CardTitle>基本情報</CardTitle>
					</div>
					<CardDescription>
						レストランの基本的な情報を入力してください
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* 店名 */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-name`}
							className="flex items-center gap-2"
						>
							<Store className="h-4 w-4" />
							店名 <span className="text-red-500">*</span>
						</Label>
						<Input
							id={`${formId}-name`}
							placeholder="例: 八丁堀食堂"
							className="text-base"
							{...register("name")}
							aria-invalid={!!errors.name}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* カテゴリ選択 */}
					<div className="space-y-3">
						<Label className="flex items-center gap-2">
							<Tag className="h-4 w-4" />
							カテゴリ <span className="text-red-500">*</span>
						</Label>
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => {
								const isSelected = selectedCategories?.includes(category.id);
								return (
									<Badge
										key={category.id}
										variant={isSelected ? "default" : "outline"}
										className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
										onClick={() => handleCategoryToggle(category.id)}
									>
										{category.name}
									</Badge>
								);
							})}
						</div>
						{errors.categoryIds && (
							<p className="text-sm text-red-500">
								{errors.categoryIds.message}
							</p>
						)}
					</div>

					{/* 評価 */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-rating`}
							className="flex items-center gap-2"
						>
							<Star className="h-4 w-4" />
							評価（0.0〜5.0）
						</Label>
						<Input
							id={`${formId}-rating`}
							type="number"
							step="0.1"
							min="0"
							max="5"
							placeholder="例: 4.5"
							className="text-base"
							{...register("rating")}
							aria-invalid={!!errors.rating}
						/>
						{errors.rating && (
							<p className="text-sm text-red-500">{errors.rating.message}</p>
						)}
					</div>

					{/* 価格帯 */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor={`${formId}-priceMin`}
								className="flex items-center gap-2"
							>
								<DollarSign className="h-4 w-4" />
								最低価格（円）
							</Label>
							<Input
								id={`${formId}-priceMin`}
								type="number"
								min="0"
								placeholder="例: 800"
								className="text-base"
								{...register("priceMin")}
								aria-invalid={!!errors.priceMin}
							/>
							{errors.priceMin && (
								<p className="text-sm text-red-500">
									{errors.priceMin.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`${formId}-priceMax`}
								className="flex items-center gap-2"
							>
								<DollarSign className="h-4 w-4" />
								最高価格（円）
							</Label>
							<Input
								id={`${formId}-priceMax`}
								type="number"
								min="0"
								placeholder="例: 1200"
								className="text-base"
								{...register("priceMax")}
								aria-invalid={!!errors.priceMax}
							/>
							{errors.priceMax && (
								<p className="text-sm text-red-500">
									{errors.priceMax.message}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 位置情報 */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<MapPin className="h-5 w-5 text-primary" />
						<CardTitle>位置情報</CardTitle>
					</div>
					<CardDescription>レストランの場所に関する情報</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* 距離 */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-distance`}
							className="flex items-center gap-2"
						>
							<Navigation className="h-4 w-4" />
							距離
						</Label>
						<Input
							id={`${formId}-distance`}
							placeholder="例: 徒歩3分"
							className="text-base"
							{...register("distance")}
							aria-invalid={!!errors.distance}
						/>
						{errors.distance && (
							<p className="text-sm text-red-500">{errors.distance.message}</p>
						)}
					</div>

					{/* 住所 */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-address`}
							className="flex items-center gap-2"
						>
							<MapPin className="h-4 w-4" />
							住所
						</Label>
						<Input
							id={`${formId}-address`}
							placeholder="例: 東京都中央区八丁堀1-2-3"
							className="text-base"
							{...register("address")}
						/>
					</div>
				</CardContent>
			</Card>

			{/* リンク・メディア情報 */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Globe className="h-5 w-5 text-primary" />
						<CardTitle>リンク・メディア</CardTitle>
					</div>
					<CardDescription>外部サイトや画像の情報</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* 食べログURL */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-tabelogUrl`}
							className="flex items-center gap-2"
						>
							<Globe className="h-4 w-4" />
							食べログURL
						</Label>
						<Input
							id={`${formId}-tabelogUrl`}
							type="url"
							placeholder="https://tabelog.com/..."
							className="text-base"
							{...register("tabelogUrl")}
							aria-invalid={!!errors.tabelogUrl}
						/>
						{errors.tabelogUrl && (
							<p className="text-sm text-red-500">
								{errors.tabelogUrl.message}
							</p>
						)}
					</div>

					{/* WebサイトURL */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-websiteUrl`}
							className="flex items-center gap-2"
						>
							<Globe className="h-4 w-4" />
							WebサイトURL
						</Label>
						<Input
							id={`${formId}-websiteUrl`}
							type="url"
							placeholder="https://example.com"
							className="text-base"
							{...register("websiteUrl")}
							aria-invalid={!!errors.websiteUrl}
						/>
						{errors.websiteUrl && (
							<p className="text-sm text-red-500">
								{errors.websiteUrl.message}
							</p>
						)}
					</div>

					{/* 画像URL */}
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-imageUrl`}
							className="flex items-center gap-2"
						>
							<ImageIcon className="h-4 w-4" />
							画像URL
						</Label>
						<Input
							id={`${formId}-imageUrl`}
							type="url"
							placeholder="https://example.com/image.jpg"
							className="text-base"
							{...register("imageUrl")}
							aria-invalid={!!errors.imageUrl}
						/>
						{errors.imageUrl && (
							<p className="text-sm text-red-500">{errors.imageUrl.message}</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* 詳細情報 */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-primary" />
						<CardTitle>詳細情報</CardTitle>
					</div>
					<CardDescription>レストランの特徴や雰囲気</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label
							htmlFor={`${formId}-description`}
							className="flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							説明
						</Label>
						<Textarea
							id={`${formId}-description`}
							placeholder="お店の特徴や雰囲気を入力してください"
							rows={4}
							className="text-base resize-none"
							{...register("description")}
						/>
					</div>
				</CardContent>
			</Card>

			{/* 送信ボタン */}
			<div className="sticky bottom-0 flex gap-4 rounded-lg border bg-background p-4 shadow-lg">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isSubmitting}
					className="flex-1"
					size="lg"
				>
					キャンセル
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="flex-1"
					size="lg"
				>
					{isSubmitting ? "追加中..." : "レストランを追加"}
				</Button>
			</div>
		</form>
	);
}
