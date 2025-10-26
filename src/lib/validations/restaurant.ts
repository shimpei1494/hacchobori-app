import { z } from "zod";

/**
 * レストラン作成フォームのバリデーションスキーマ
 */
export const restaurantFormSchema = z.object({
  name: z.string().min(1, "店名は必須です").max(255, "店名は255文字以内で入力してください"),
  priceMin: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = Number.parseInt(val, 10);
        return !Number.isNaN(num) && num >= 0;
      },
      {
        message: "最低価格は0円以上で入力してください",
      },
    ),
  priceMax: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = Number.parseInt(val, 10);
        return !Number.isNaN(num) && num >= 0;
      },
      {
        message: "最高価格は0円以上で入力してください",
      },
    ),
  distance: z.string().max(50, "距離は50文字以内で入力してください").optional(),
  googleMapUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  tabelogUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  websiteUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  description: z.string().optional(),
  imageUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  categoryIds: z.array(z.string()).min(1, "カテゴリを最低1つ選択してください"),
  isActive: z.boolean().default(true),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;
