import { z } from "zod";

/**
 * 食べログURLから抽出されるレストラン情報のスキーマ
 */
export const extractedRestaurantSchema = z.object({
  name: z.string().describe("レストラン・店舗の名前"),
  genres: z.array(z.string()).describe("ジャンル・料理カテゴリの配列（例: ['ラーメン', '海鮮']）。該当するカテゴリがない場合は空配列"),
  priceMin: z.number().nullable().describe("最低価格（円）。不明な場合はnull"),
  priceMax: z.number().nullable().describe("最高価格（円）。不明な場合はnull"),
  address: z.string().nullable().describe("住所。不明な場合はnull"),
  description: z.string().nullable().describe("店舗の説明・特徴。HTMLから抽出した特徴や雰囲気"),
  businessHours: z.string().nullable().describe("営業時間。不明な場合はnull"),
});

export type ExtractedRestaurant = z.infer<typeof extractedRestaurantSchema>;

/**
 * 食べログからスクレイピングしたHTMLからレストラン情報を抽出する結果型
 */
export type ExtractRestaurantResult =
  | {
    success: true;
    data: ExtractedRestaurant;
    matchedCategoryIds: string[];
    tabelogUrl: string;
  }
  | {
    success: false;
    error: string;
  };
