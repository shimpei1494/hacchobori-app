# Hacchobori App

八丁堀周辺のランチ情報を管理・共有するWebアプリケーション

## 概要

このアプリケーションは、オフィス周辺（八丁堀エリア）のレストラン情報を登録・管理し、チームメンバーとランチ情報を共有するためのツールです。カテゴリー検索、お気に入り機能、AI相談チャットなどを備えています。

### 主な機能

- **レストラン管理**: 店舗情報の登録・編集・検索
- **カテゴリー管理**: ラーメン、カフェ、定食などのカテゴリー分類
- **お気に入り機能**: ユーザーごとのお気に入り店舗管理
- **AI相談チャット**: AIを利用したランチ相談機能
- **Google OAuth認証**: Better Authによる安全なユーザー認証

## 技術構成

### フロントエンド

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **スタイリング**: Tailwind CSS 4
- **UIコンポーネント**: Shadcn/ui（Radix UI）
- **状態管理**: Jotai
- **フォーム**: React Hook Form + Zod
- **アニメーション**: Motion (Framer Motion)

### バックエンド

- **データベース**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **認証**: Better Auth (Google OAuth)
- **AI**: Vercel AI SDK + Vercel AI Gateway

### 開発環境

- **言語**: TypeScript
- **Linter/Formatter**: Biome
- **コンテナ（ローカル時のDB）**: Docker Compose
- **パッケージマネージャー**: npm

### データベーススキーマ

主要なテーブル構成:

- `users`: ユーザー情報（Better Auth連携）
- `sessions`: セッション管理
- `accounts`: OAuth アカウント情報
- `categories`: レストランカテゴリー
- `restaurants`: レストラン情報
- `restaurant_categories`: レストランとカテゴリーの多対多関連
- `favorites`: ユーザーのお気に入り

## 開発セットアップ

### 必要要件

- Node.js 18以上
- Docker & Docker Compose

### 環境構築

1. リポジトリのクローン
```bash
git clone <repository-url>
cd hacchobori-app
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定
```

4. データベースのセットアップ
```bash
npm run db:setup
```

5. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## スクリプト

### 開発

- `npm run dev`: 開発サーバー起動
- `npm run dev:full`: Docker起動 + 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバー起動

### データベース

- `npm run docker:up`: PostgreSQLコンテナ起動
- `npm run docker:down`: PostgreSQLコンテナ停止
- `npm run db:push`: スキーマをDBにプッシュ
- `npm run db:studio`: Drizzle Studioを起動
- `npm run db:seed`: サンプルデータ投入
- `npm run db:setup`: DB環境の完全セットアップ

### コード品質

- `npm run check`: Biomeによるlint + format チェック
- `npm run check:fix`: Biomeによる自動修正
- `npm run type-check`: TypeScript型チェック

## ライセンス

Private
