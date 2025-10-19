"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { CategoryWithUsage } from "@/app/actions/categories";
import { deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryWithUsage;
  onSuccess: () => void;
}

export function CategoryDeleteDialog({ open, onOpenChange, category, onSuccess }: CategoryDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const canDelete = category.usageCount === 0;

  const handleDelete = () => {
    if (!canDelete) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(category.id);

      if (result.success) {
        toast.success("カテゴリーを削除しました");
        onSuccess();
      } else {
        toast.error(result.error || "削除に失敗しました");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>カテゴリーを削除</DialogTitle>
          <DialogDescription>
            {canDelete
              ? "このカテゴリーを削除してもよろしいですか？この操作は元に戻せません。"
              : "このカテゴリーを削除するには、使用中のレストランから先にカテゴリーを外してください。"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">カテゴリー名</span>
              <span className="text-sm">{category.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">識別名</span>
              <span className="text-sm text-muted-foreground">{category.slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">使用中のレストラン数</span>
              <span
                className={`text-sm font-bold ${category.usageCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {category.usageCount}件
              </span>
            </div>
          </div>

          {!canDelete && (
            <div className="mt-4 p-4 bg-muted/50 border border-border rounded-md">
              <p className="text-sm font-medium mb-2">削除するための手順：</p>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>使用中の{category.usageCount}件のレストランを編集</li>
                <li>それぞれのレストランから「{category.name}」カテゴリーを外す</li>
                <li>すべてのレストランから外したら、このカテゴリーを削除できます</li>
              </ol>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {canDelete ? "キャンセル" : "閉じる"}
          </Button>
          {canDelete && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "削除中..." : "削除"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
