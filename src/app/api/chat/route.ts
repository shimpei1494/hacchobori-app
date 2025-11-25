import { convertToModelMessages, streamText } from "ai";
import { getAllRestaurants } from "@/lib/ai/tools";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("=== API Route Debug ===");
    console.log("Received messages:", JSON.stringify(messages, null, 2));

    // DBから全レストラン情報を取得
    const restaurantData = await getAllRestaurants();
    console.log("Fetched restaurants:", restaurantData.count);

    // レストラン情報をテキスト形式に整形
    const restaurantsContext = restaurantData.restaurants
      .map((r) => {
        const categories = r.restaurantCategories.map((rc) => rc.category.name).join(", ");
        return `
【${r.name}】
- カテゴリ: ${categories}
- 価格帯: ${r.priceMin ? `¥${r.priceMin}` : "不明"}〜${r.priceMax ? `¥${r.priceMax}` : "不明"}
- 距離: 徒歩${r.distance || "不明"}
- 説明: ${r.description || "なし"}
- 食べログ: ${r.tabelogUrl || "なし"}
- 地図: ${r.googleMapUrl || "なし"}
- 公式サイト: ${r.websiteUrl || "なし"}
`.trim();
      })
      .join("\n\n");

    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: convertToModelMessages(messages),
      system: `あなたは八丁堀周辺のランチレストランを案内する親切なアシスタントです。

以下は利用可能な全レストラン情報です。この情報を参照してユーザーの質問に回答してください。

===== レストラン情報 =====
${restaurantsContext}
===== レストラン情報ここまで =====

ユーザーの質問に対して、上記のレストラン情報を参照しながら、日本語で丁寧に回答してください。

【回答ガイドライン】
1. ユーザーの条件（価格、距離、カテゴリなど）に合うレストランを選別する
2. 条件に合うお店を2-3件程度、簡潔に紹介する
3. 各お店について以下を含める：
   - 店名（太字）
   - カテゴリ
   - 価格帯
   - 距離
   - 簡単な説明や特徴
   - 食べログURL（あれば）
   - GoogleマップURL（あれば）
   - 公式サイトURL（あれば）

回答例：
「800円以内で徒歩5分以内のラーメン屋をご紹介します。

1. **麺屋 龍**（ラーメン）
   - 価格: ¥700〜¥900
   - 距離: 徒歩3分
   - 醤油ラーメンが人気の老舗店です。
   - 食べログ: https://tabelog.com/...
   - 地図: https://maps.google.com/...

2. **ラーメン横丁**（ラーメン）
   - 価格: ¥650〜¥850
   - 距離: 徒歩4分
   - 豚骨ベースのこってりラーメンが特徴です。
   - 食べログ: https://tabelog.com/...」
`,
    });

    console.log("StreamText result created successfully");
    const response = result.toUIMessageStreamResponse();
    console.log("Response created:", response);
    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    return new Response(
      JSON.stringify({
        error: "チャット処理中にエラーが発生しました",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
