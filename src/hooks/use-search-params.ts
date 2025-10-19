import { parseAsString, useQueryStates } from "nuqs";

/**
 * 検索パラメータ管理用のカスタムフック
 * URLクエリパラメータとして検索条件を保持し、共有可能にする
 */
export function useSearchParams() {
  return useQueryStates(
    {
      // 検索クエリ: ?q=ラーメン
      q: parseAsString.withDefault(""),
      // カテゴリーフィルター（slugベース）: ?category=japanese
      category: parseAsString.withDefault("all"),
      // お気に入りフィルター: ?favorite=true
      favorite: parseAsString.withDefault(""),
    },
    {
      // URL更新時のスクロール位置を保持
      scroll: false,
      // ブラウザ履歴に記録（戻る/進むで状態復元）
      history: "push",
    },
  );
}
