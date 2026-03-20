# SP FAQ

## 概要
Google Sheets を FAQ ソースとして使い、Gemini API で回答する Next.js チャットアプリ。

## 技術スタック
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Firebase Auth (メール/パスワード)
- @google/generative-ai (Gemini 2.0 Flash)
- googleapis (Sheets API v4)

## ディレクトリ構成
```
src/
  app/
    page.tsx              - チャット画面 (AuthGuard で保護)
    login/page.tsx        - ログイン画面
    api/chat/route.ts     - POST /api/chat (FAQ回答)
    api/faq/refresh/route.ts - POST /api/faq/refresh (キャッシュ更新)
  components/
    AuthGuard.tsx         - 認証ガード
  context/
    AuthContext.tsx       - Firebase Auth コンテキスト
  lib/
    firebase/client.ts    - Firebase クライアント SDK
    firebase/admin.ts     - Firebase Admin SDK
    sheets.ts             - Google Sheets FAQ 取得 (30分キャッシュ)
    gemini.ts             - Gemini API 呼び出し
  types/index.ts          - 型定義
```

## FAQ スプレッドシートのフォーマット
| A: カテゴリ | B: 質問 (Q) | C: 回答 (A) | D: タグ (任意) |
|---|---|---|---|
| 料金 | 利用料金は？ | 月額〇〇円です | 料金,プラン |

- 1行目: ヘッダー行 (スキップされる)
- 2行目以降: データ

## 環境変数
`.env.local.example` を参照。`.env.local` にコピーして値を設定。

## スプレッドシートの共有設定
`GOOGLE_SERVICE_ACCOUNT_KEY` のサービスアカウントメールアドレスに、
スプレッドシートを閲覧者として共有する必要がある。

## Gemini の回答ルール
- FAQに記載された回答文のみを返す（推論・補完禁止）
- 複数項目が該当する場合は回答を組み合わせて返す
- 該当なし → 「申し訳ありません、その内容はFAQに登録されていません。」

## ローカル起動
```bash
cp .env.local.example .env.local
# .env.local に各値を設定
npm run dev
```
