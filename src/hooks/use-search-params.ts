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
      // カテゴリーフィルター: ?category=和食
      category: parseAsString.withDefault("すべて"),
    },
    {
      // URL更新時のスクロール位置を保持
      scroll: false,
      // ブラウザ履歴に記録（戻る/進むで状態復元）
      history: "push",
    },
  );
}
