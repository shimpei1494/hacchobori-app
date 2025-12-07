import { z } from "zod";

export const profileFormSchema = z.object({
  displayName: z.string().max(20, "表示名は20文字以内にしてください").optional().or(z.literal("")),
  companyEmail: z
    .email("有効なメールアドレスを入力してください")
    .refine((email) => email === "" || email.endsWith("@re-birth-it.jp"), {
      message: "有効なメールアドレスを入力してください",
    })
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
