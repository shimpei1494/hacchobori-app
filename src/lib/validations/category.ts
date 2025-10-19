import { z } from "zod";

/**
 * カテゴリーフォームのバリデーションスキーマ
 */
export const categoryFormSchema = z.object({
  name: z.string().min(1, "カテゴリー名を入力してください").max(15, "カテゴリー名は15文字以内で入力してください"),
  slug: z
    .string()
    .min(1, "識別名を入力してください")
    .max(30, "識別名は30文字以内で入力してください")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "識別名は小文字の英数字とハイフンのみ使用できます（先頭・末尾のハイフンは不可）",
    ),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
