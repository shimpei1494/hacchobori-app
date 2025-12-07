"use server";

import { generateObject } from "ai";
import type { Category } from "@/db/schema";
import {
  type ExtractedRestaurant,
  type ExtractRestaurantResult,
  extractedRestaurantSchema,
} from "@/types/extract-restaurant";

/**
 * HTMLから必要な情報（JSON-LD、メタタグ、タイトル）のみを抽出
 * トークン消費を約83%削減
 */
function extractEssentialHtml(html: string): string {
  // JSON-LD（構造化データ）を抽出
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];

  // タイトルを抽出
  const titleMatch = html.match(/<title>[\s\S]*?<\/title>/);

  // メタタグ（og:*, description等）を抽出
  const metaMatches = html.match(/<meta[^>]*>/g) || [];

  return `
${titleMatch ? titleMatch[0] : ""}
${metaMatches.join("\n")}
${jsonLdMatches.join("\n")}
  `.trim();
}

/**
 * 食べログのHTMLからレストラン情報をAIで抽出
 */
async function extractRestaurantFromHtml(html: string, availableCategories: Category[]): Promise<ExtractedRestaurant> {
  const categoryNames = availableCategories.map((c) => c.name).join("、");

  // 必要な情報のみを抽出（トークン削減）
  const essentialHtml = extractEssentialHtml(html);

  const result = await generateObject({
    model: "openai/gpt-5-mini",
    schema: extractedRestaurantSchema,
    prompt: `以下は食べログの店舗ページから抽出した重要情報です。JSON-LD形式の構造化データ（"@type":"Restaurant"）を優先的に参照して、レストラン情報を抽出してください。

【重要】ジャンル選択について:
- HTMLのJSON-LD内の"servesCuisine"フィールド、またはタイトル・メタタグからジャンルを確認
- 以下のカテゴリから該当するものを全て選択してください（複数選択可）:
  ${categoryNames}
- 例: "servesCuisine":"食堂、洋食、からあげ" の場合 → ["定食", "洋食"] を選択
- 例: "servesCuisine":"ラーメン" の場合 → ["ラーメン"] を選択
- どれにも当てはまらない場合は空配列 [] を返してください

価格について:
- JSON-LDの"priceRange"や口コミから価格帯を抽出
- ランチの価格帯を優先して抽出してください
- 「〜1000円」のような表記は priceMax: 1000 として解釈
- 「1000円〜2000円」のような表記は priceMin: 1000, priceMax: 2000

住所について:
- JSON-LDの"address"フィールドから抽出

説明について:
- 店舗の特徴、雰囲気、おすすめメニューなどを簡潔にまとめてください
- 200文字程度に収めてください
- JSON-LD内のレビュー情報も参考にしてください

HTML（抽出済み）:
${essentialHtml}`,
  });

  return result.object;
}

/**
 * 食べログURLからレストラン情報を抽出するメイン関数
 */
export async function extractRestaurantFromTabelog(
  url: string,
  availableCategories: Category[],
): Promise<ExtractRestaurantResult> {
  // URLの検証
  if (!url || !url.includes("tabelog.com")) {
    return {
      success: false,
      error: "有効な食べログURLを入力してください",
    };
  }

  try {
    // 食べログページをfetch
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `ページの取得に失敗しました (HTTP ${response.status})`,
      };
    }

    const html = await response.text();

    // HTMLが空または異常に短い場合
    if (html.length < 1000) {
      return {
        success: false,
        error: "ページの内容を取得できませんでした",
      };
    }

    // AIでレストラン情報を抽出(カテゴリ一覧を渡す)
    const extracted = await extractRestaurantFromHtml(html, availableCategories);

    // AIが選択したカテゴリ名からIDを取得(マッチしない場合は空配列)
    const matchedCategoryIds = extracted.genres
      .map((genreName) => availableCategories.find((c) => c.name === genreName)?.id)
      .filter((id): id is string => id !== undefined);

    return {
      success: true,
      data: extracted,
      matchedCategoryIds,
      tabelogUrl: url,
    };
  } catch (error) {
    console.error("Failed to extract restaurant from tabelog:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "情報の抽出中にエラーが発生しました",
    };
  }
}
