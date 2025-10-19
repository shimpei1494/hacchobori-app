"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, Edit2, GripVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CategoryWithUsage } from "@/app/actions/categories";
import { updateCategoryOrder } from "@/app/actions/categories";
import { CategoryDeleteDialog } from "@/components/category-delete-dialog";
import { CategoryFormDialog } from "@/components/category-form-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CategoriesManagerProps {
  initialCategories: CategoryWithUsage[];
}

function SortableCategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryWithUsage;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card className="p-4 mb-2">
        <div className="flex items-center gap-3">
          {/* ドラッグハンドル */}
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* カテゴリー情報 */}
          <div className="flex-1">
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              {category.slug} • {category.usageCount}件のレストランで使用中
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<CategoryWithUsage | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithUsage | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [_isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);

    // サーバーに並び順を送信
    startTransition(async () => {
      const result = await updateCategoryOrder(newCategories.map((cat) => cat.id));
      if (!result.success) {
        toast.error(result.error || "並び替えに失敗しました");
        // エラー時は元に戻す
        setCategories(categories);
      } else {
        toast.success("並び替えを保存しました");
      }
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1" />
              一覧に戻る
            </Link>
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            新規追加
          </Button>
        </div>

        <h1 className="text-2xl font-bold">カテゴリー管理</h1>
        <p className="text-muted-foreground mt-2">カテゴリーを追加・編集・並び替えができます</p>
      </div>

      {/* カテゴリーリスト */}
      <div>
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">カテゴリーがありません</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-1" />
              最初のカテゴリーを追加
            </Button>
          </Card>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
              {categories.map((category) => (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* 新規作成ダイアログ */}
      <CategoryFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={(newCategory) => {
          setCategories([...categories, { ...newCategory, usageCount: 0 }]);
          setShowCreateDialog(false);
        }}
      />

      {/* 編集ダイアログ */}
      {editingCategory && (
        <CategoryFormDialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          category={editingCategory}
          onSuccess={(updatedCategory) => {
            setCategories(
              categories.map((cat) =>
                cat.id === updatedCategory.id ? { ...updatedCategory, usageCount: cat.usageCount } : cat,
              ),
            );
            setEditingCategory(null);
          }}
        />
      )}

      {/* 削除確認ダイアログ */}
      {deletingCategory && (
        <CategoryDeleteDialog
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          category={deletingCategory}
          onSuccess={() => {
            setCategories(categories.filter((cat) => cat.id !== deletingCategory.id));
            setDeletingCategory(null);
          }}
        />
      )}
    </div>
  );
}
