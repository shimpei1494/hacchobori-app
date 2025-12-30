import { z } from "zod";
import env from "@/lib/env";

export const profileFormSchema = z.object({
  displayName: z.string().max(20, "表示名は20文字以内にしてください").optional().or(z.literal("")),
  companyEmail: z
    .email("有効なメールアドレスを入力してください")
    .refine(
      (email) => email === "" || email.endsWith(env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN),
      {
        message: "有効なメールアドレスを入力してください",
      },
    )
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
