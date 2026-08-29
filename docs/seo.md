# SEO基盤設計（robots.txt / sitemap / JSON-LD）

> 検索エンジンに正しくインデックスさせ、リッチスニペット表示を狙うための基盤設定。

## 基本方針

- **Next.js App Router のネイティブ機能を活用**（`sitemap.ts`、`MetadataRoute`）
- **シンプルに保つ**: 過剰な構造化データは入れない。必要最小限で効果を出す
- **統一パターン**: 他のプロジェクトと同じ技術スタック・構成

## 1. robots.txt

**ファイル:** `public/robots.txt`

| 項目 | 値 | 理由 |
|------|-----|------|
| Allow | `/` | 全ページ |
| Sitemap | `https://swipeocean.surf/sitemap.xml` | |

OGP画像は Disallow 不要（静的ファイル配置のため検索画像として表示されてOK）。

## 2. sitemap.xml

**ファイル:** `src/app/sitemap.ts`（Next.js が自動で `/sitemap.xml` を生成）

| URL | priority | changeFrequency |
|-----|----------|-----------------|
| `/` | 1.0 | weekly |
| `/swipe` | 0.8 | monthly |
| `/result/{type}` ×8 | 0.9 | monthly |

**除外:** `/result`（リダイレクト専用、コンテンツなし）

## 3. JSON-LD 構造化データ

**ファイル:** `src/app/layout.tsx`（`<body>` 内の `<script type="application/ld+json">`）

### 設計判断

- **`WebApplication` を選択**: パーソナリティチェックアプリとしてリッチスニペット表示を狙う
- **`applicationCategory: "EntertainmentApplication"`**: 娯楽系Webアプリとして分類
- **`offers` で無料を明示**: Google 検索結果で「無料」バッジ表示の可能性
- **結果ページ個別の JSON-LD は入れない**: `Quiz` スキーマ等は過剰（ルートのみで十分）

## ファイル構成

| ファイル | 内容 |
|----------|------|
| `public/robots.txt` | クローラー制御 |
| `src/app/sitemap.ts` | サイトマップ自動生成 |
| `src/app/layout.tsx` | JSON-LD 構造化データ |

## 参考

- [Next.js Metadata: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js Metadata: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [schema.org WebApplication](https://schema.org/WebApplication)
