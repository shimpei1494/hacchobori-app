"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import type { CategoryWithUsage } from "@/app/actions/categories";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/db/schema";
import { categoryFormSchema } from "@/lib/validations/category";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  existingCategories: CategoryWithUsage[];
  onSuccess: (category: Category) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  existingCategories,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [isPending, startTransition] = useTransition();
  const nameId = useId();
  const slugId = useId();

  // ダイアログが開いたときに値をリセット
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName(category?.name || "");
      setSlug(category?.slug || "");
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. 入力値のバリデーション
    const validation = categoryFormSchema.safeParse({ name, slug });
    if (!validation.success) {
      const fieldErrors: { name?: string; slug?: string } = {};
      for (const error of validation.error.errors) {
        if (error.path[0] === "name") {
          fieldErrors.name = error.message;
        } else if (error.path[0] === "slug") {
          fieldErrors.slug = error.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // 2. クライアント側で重複チェック（既存データと照合）
    const duplicates = existingCategories.filter((cat) => {
      // 編集時は自分自身を除外
      if (isEditing && cat.id === category.id) {
        return false;
      }
      return cat.name === validation.data.name.trim() || cat.slug === validation.data.slug.trim();
    });

    if (duplicates.length > 0) {
      const fieldErrors: { name?: string; slug?: string } = {};
      const nameExists = duplicates.some((cat) => cat.name === validation.data.name.trim());
      const slugExists = duplicates.some((cat) => cat.slug === validation.data.slug.trim());

      if (nameExists) {
        fieldErrors.name = "このカテゴリー名は既に使用されています";
      }
      if (slugExists) {
        fieldErrors.slug = "この識別名は既に使用されています";
      }
      setErrors(fieldErrors);
      return;
    }

    // 3. DB保存（他のユーザーの同時更新にも対応）
    startTransition(async () => {
      const result = isEditing
        ? await updateCategory(category.id, validation.data.name, validation.data.slug)
        : await createCategory(validation.data.name, validation.data.slug);

      if (result.success) {
        toast.success(isEditing ? "カテゴリーを更新しました" : "カテゴリーを作成しました");
        onSuccess({
          id: result.categoryId || category?.id || "",
          name: validation.data.name,
          slug: validation.data.slug,
          displayOrder: category?.displayOrder || 0,
          createdAt: category?.createdAt || new Date(),
        });
        setName("");
        setSlug("");
        setErrors({});
      } else {
        // サーバー側で エラーが発生した場合（同時編集のケースなど）
        toast.error(result.error || "エラーが発生しました");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "カテゴリーを編集" : "新しいカテゴリーを追加"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "カテゴリーの名前と識別名を変更できます" : "新しいカテゴリーの名前と識別名を入力してください"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor={nameId}>カテゴリー名</Label>
              <Input
                id={nameId}
                placeholder="例: 和食"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={slugId}>識別名</Label>
              <Input
                id={slugId}
                placeholder="例: japanese"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isPending}
                className={errors.slug ? "border-destructive" : ""}
              />
              {errors.slug ? (
                <p className="text-sm text-destructive">{errors.slug}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  システム内部で使用する識別名です。小文字の英数字とハイフン(-)のみ使用できます。
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "処理中..." : isEditing ? "更新" : "作成"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
