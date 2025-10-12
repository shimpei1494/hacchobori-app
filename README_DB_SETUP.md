# データベースセットアップガイド

## 概要

このプロジェクトでは、PostgreSQLとDrizzle ORMを使用してデータベースを管理しています。

## 必要な環境

- Docker & Docker Compose
- Node.js 18以上

## セットアップ手順

### 1. 環境変数の設定

プロジェクトルートに `.env` ファイルが作成されていることを確認してください。

```bash
# .env ファイルの内容
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hacchobori_db"
BETTER_AUTH_SECRET="your-32-character-secret-key-here-replace-this-value"
BETTER_AUTH_URL="http://localhost:3000"
```

### 2. PostgreSQLコンテナの起動

```bash
npm run docker:up
```

これにより、PostgreSQL 16のDockerコンテナが起動します。

### 3. データベース接続の確認

```bash
npm run db:health
```

データベース接続が正常であることを確認します。

### 4. テーブルの作成

```bash
npm run db:push
```

Drizzle Kitが `src/db/schema.ts` の定義に基づいてテーブルを作成します。

### 5. 仮データの投入

```bash
npm run db:seed
```

以下のデータが投入されます:
- テストユーザー: 1件
- カテゴリー: 8件（ラーメン、定食、カフェ、イタリアン、和食、中華、海鮮、カレー）
- レストラン: 7件（八丁堀周辺のサンプルデータ）
- レストラン-カテゴリーのリレーション

### ワンコマンドセットアップ

上記の手順を一度に実行できます:

```bash
npm run db:setup
```

このコマンドは以下を順番に実行します:
1. Dockerコンテナ起動
2. 5秒待機（DB起動待ち）
3. DB接続確認
4. テーブル作成
5. 仮データ投入

## 便利なコマンド

### Drizzle Studio（GUIツール）

```bash
npm run db:studio
```

ブラウザでデータベースを視覚的に操作できます。

### マイグレーション

```bash
npm run db:migrate
```

マイグレーションファイルを適用します。

### Dockerコンテナの停止

```bash
npm run docker:down
```

### Dockerログの確認

```bash
npm run docker:logs
```

## テーブル構成

### 認証関連テーブル（BetterAuth用）

- `users`: ユーザー情報
- `sessions`: セッション管理
- `accounts`: アカウント連携（OAuth等）
- `verifications`: メール認証等

### アプリケーションテーブル

- `categories`: レストランカテゴリー
- `restaurants`: レストラン情報
- `restaurant_categories`: レストランとカテゴリーの多対多リレーション
- `favorites`: ユーザーのお気に入りレストラン

## トラブルシューティング

### データベース接続エラー

```bash
# Dockerコンテナの状態確認
docker ps

# PostgreSQLコンテナのログ確認
npm run docker:logs
```

### テーブルの再作成

```bash
# コンテナを停止してボリュームも削除
npm run docker:down
docker volume rm hacchobori_postgres_data

# 再度セットアップ
npm run db:setup
```

### スキーマ変更時

`src/db/schema.ts` を変更した後:

```bash
npm run db:push
```

開発環境では `db:push` で十分ですが、本番環境では適切なマイグレーション管理が必要です。

## 参考リンク

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [BetterAuth Documentation](https://www.better-auth.com/)
