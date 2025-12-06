# 食べログスクレイピング仕様書

**最終更新日**: 2025年12月3日  
**対象URL**: https://tabelog.com/tokyo/A1302/A130203/13142931/（八丁堀食堂）

## 概要

食べログの店舗ページから、レストラン情報を取得してデータベースに登録する機能の技術仕様です。
トークン消費を最適化するため、HTML全体ではなく**JSON-LD構造化データとメタタグのみ**を抽出してAIに送信しています。

---

## 取得データの内訳

### 1. HTML全体の情報

| 項目 | 値 |
|-----|-----|
| 総サイズ | 220,737 bytes（約220KB） |
| scriptタグ | 56個 |
| 広告関連タグ | 81箇所（googletag, GTM, adsystem等） |
| JSON-LD | 3箇所（Restaurant, FAQPage） |

**内訳:**
- 広告・トラッキングスクリプト: 約60%
- CSS・JavaScript参照: 約15%
- 実データ（JSON-LD、メタタグ等）: 約5%
- その他（HTML構造、コメント等）: 約20%

---

## 抽出している情報（最適化後）

### トークン削減効果

| 方式 | サイズ | トークン数 | コスト/回 |
|-----|--------|-----------|----------|
| HTML全体 | 220KB | 約55,000 | $0.0083 |
| 最初50KB（変更前） | 50KB | 約12,500 | $0.0019 |
| **JSON-LD+メタタグ（最適化後）** | **約9KB** | **約2,200** | **$0.0003** |

**削減率**: 83%のトークン削減（GPT-4o-mini: $0.15/1M input tokens）

---

## 抽出対象の詳細

### 1. JSON-LD構造化データ（Restaurant）

食べログの全ページには`<script type="application/ld+json">`形式で構造化データが埋め込まれています。

#### サンプルデータ

```json
{
  "@context": "http://schema.org",
  "@type": "Restaurant",
  "@id": "https://tabelog.com/tokyo/A1302/A130203/13142931/",
  "name": "八丁堀食堂",
  "image": "https://tblg.k-img.com/restaurant/images/Rvw/308441/640x640_rect_4fa51039fef613ec7ee2cfb4037b6405.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "八丁堀3-22-13",
    "addressLocality": "中央区",
    "addressRegion": "東京都",
    "postalCode": "1040032",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.67528193791794,
    "longitude": 139.77747608315482
  },
  "priceRange": "～￥999",
  "servesCuisine": "食堂、洋食、からあげ",
  "telephone": "非公開",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingCount": "194",
    "ratingValue": "3.46"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "vfle8"
      },
      "reviewBody": "八丁堀駅近くにある定食屋さん。平日12時すぎに訪問...",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "3.6"
      }
    }
    // 通常3件のレビューが含まれる
  ]
}
```

#### 利用可能な情報

| フィールド | 説明 | 現在の使用状況 |
|-----------|------|--------------|
| `name` | 店舗名 | ✅ 使用中 |
| `servesCuisine` | ジャンル（例: "食堂、洋食、からあげ"） | ✅ 使用中（カテゴリマッピング） |
| `priceRange` | 価格帯（例: "～￥999"） | ✅ 使用中 |
| `address` | 住所情報（郵便番号、都道府県、市区町村、番地） | ✅ 使用中 |
| `geo` | 緯度経度 | ❌ 未使用（将来の地図機能で活用可能） |
| `telephone` | 電話番号 | ❌ 未使用（非公開の場合が多い） |
| `aggregateRating` | 評価（平均点、レビュー数） | ✅ 使用中（説明文生成に活用） |
| `review` | 口コミ情報（3件） | ✅ 使用中（説明文生成に活用） |
| `image` | 店舗画像URL | ❌ 未使用（将来の画像表示機能で活用可能） |

---

### 2. メタタグ

#### タイトルタグ
```html
<title>八丁堀食堂 - 八丁堀/食堂 | 食べログ</title>
```

**使用目的**: 店舗名とジャンルの確認（JSON-LDのバックアップ）

#### メタタグ（description）
```html
<meta name="description" content="八丁堀食堂 (八丁堀/食堂)の店舗情報は食べログでチェック！ 【禁煙】口コミや評価、写真など、ユーザーによるリアルな情報が満載です！地図や料理メニューなどの詳細情報も充実。" />
```

#### OGPメタタグ
```html
<meta property="og:title" content="八丁堀食堂 (八丁堀/食堂)">
<meta property="og:description" content="★★★☆☆3.46 ■予算(昼):～￥999">
<meta property="og:image" content="https://tblg.k-img.com/resize/640x640c/restaurant/images/Rvw/308441/4fa51039fef613ec7ee2cfb4037b6405.jpg?token=ebe001b&api=v2">
```

**使用目的**: 評価と価格帯の追加ソース

---

### 3. FAQデータ（JSON-LD）

営業時間、アクセス情報などが含まれる2つ目のJSON-LD。

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "営業時間・定休日を教えてください",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[火] 11:00 - 14:00\n[木] 11:00 - 14:00\n[金] 11:00 - 14:00"
      }
    },
    {
      "@type": "Question",
      "name": "アクセス方法を教えてください",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "東京メトロ日比谷線 八丁堀駅30秒"
      }
    }
  ]
}
```

**現在の使用状況**: ❌ 未使用（将来の営業時間・定休日機能で活用可能）

---

## 実装コード

### 抽出関数（`src/lib/ai/extract-restaurant.ts`）

```typescript
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
${titleMatch ? titleMatch[0] : ''}
${metaMatches.join('\n')}
${jsonLdMatches.join('\n')}
  `.trim();
}
```

### AIプロンプト（抜粋）

```typescript
prompt: `以下は食べログの店舗ページから抽出した重要情報です。
JSON-LD形式の構造化データ（"@type":"Restaurant"）を優先的に参照して、
レストラン情報を抽出してください。

【重要】ジャンル選択について:
- HTMLのJSON-LD内の"servesCuisine"フィールド、またはタイトル・メタタグからジャンルを確認
- 以下のカテゴリから最も適切なものを1つ選択してください:
  ${categoryNames} // DBから動的に取得

価格について:
- JSON-LDの"priceRange"や口コミから価格帯を抽出
- ランチの価格帯を優先

住所について:
- JSON-LDの"address"フィールドから抽出

説明について:
- 店舗の特徴、雰囲気、おすすめメニューなどを簡潔にまとめてください
- 200文字程度に収めてください
- JSON-LD内のレビュー情報も参考にしてください

HTML（抽出済み）:
${essentialHtml}
`
```

---

## 将来の拡張可能性

### 現在未使用だが取得可能な情報

#### 1. **地図機能**
- `geo.latitude` / `geo.longitude` - 緯度経度
- `googleMapUrl` - Google Mapsリンク（現在はユーザー入力）

**実装案**: 地図表示機能を追加し、店舗位置をマッピング

#### 2. **営業時間・定休日**
- FAQデータの営業時間情報
- 自動でカレンダー表示や「本日営業中」判定が可能

**実装案**: データベースに`businessHours`テーブルを追加

#### 3. **画像表示**
- `image` - 店舗のメイン画像URL
- 高画質画像がCDN経由で提供される

**実装案**: レストランカードに画像を表示

#### 4. **評価・レビュー機能**
- `aggregateRating` - 平均評価とレビュー数
- `review` - 実際の口コミ3件

**実装案**: 
- 食べログの評価を表示
- 口コミのサマリーを自動生成

#### 5. **電話番号**
- `telephone` - 電話番号（公開店舗のみ）

**実装案**: 電話リンク機能（`tel:`）

#### 6. **複数ジャンル対応**
- 現在は`servesCuisine`から1つだけ選択
- 実際は「食堂、洋食、からあげ」のように複数ジャンルが記載

**実装案**: 
- 複数カテゴリの紐付けに対応（現在も可能）
- AIに複数選択させる

---

## パフォーマンス指標

### スクレイピング実行時間

| 処理 | 時間 |
|-----|------|
| HTTP fetch | 約500-800ms |
| HTML抽出 | 約5-10ms |
| AI分析（OpenAI API） | 約2-4秒 |
| カテゴリマッピング | 約1ms |
| **合計** | **約2.5-5秒** |

### コスト試算（GPT-4o-mini）

| 項目 | 値 |
|-----|-----|
| Input tokens | 約2,200（抽出後） |
| Output tokens | 約300（レストラン情報） |
| コスト/回 | 約$0.0004 |
| 月間100件登録 | 約$0.04 |
| 年間1,200件登録 | 約$0.48 |

**結論**: 非常に低コストで運用可能

---

## 注意事項

### 利用規約

食べログの利用規約では、個人の範囲内での利用は許可されていますが、以下に注意：
- 商用利用や大量スクレイピングは禁止
- User-Agentを偽装してブラウザとして振る舞う
- アクセス頻度を制限（Rate Limiting推奨）

### エラーハンドリング

| エラーケース | 対処 |
|------------|------|
| HTTP 403/404 | ユーザーにエラー表示 |
| JSON-LD不在 | メタタグからフォールバック |
| AI解析失敗 | ルールベースマッチングにフォールバック |
| カテゴリ不一致 | 「その他」カテゴリに分類 |

---

## 更新履歴

- **2025年12月3日**: 初版作成。トークン最適化実装（83%削減）。JSON-LD優先抽出に変更。
