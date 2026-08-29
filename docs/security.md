# Swipe Ocean セキュリティ監査・対策

## 概要

Cloudflare Workers デプロイにおけるセキュリティ対策とCloudflare側の推奨設定を記載。

## 監査結果

### 問題なし（対応不要）

| カテゴリ | 状態 | 詳細 |
|----------|------|------|
| XSS対策 | 良好 | `dangerouslySetInnerHTML` は JSON-LD の `JSON.stringify()` のみ（注入不可）。`eval()` 不使用。React自動エスケープに依存 |
| API入力バリデーション | 良好 | サーバーサイドAPIエンドポイントなし（全てクライアント完結） |
| 外部リンク | 良好 | 全て `rel="noopener noreferrer"` 付き |
| シェア機能 | 良好 | `encodeURIComponent()` で適切にエンコード |
| localStorage | 良好 | 非機密データのみ（`swipeResults`, `selectedImages`）。認証トークン等なし |
| オープンリダイレクト | なし | 全ナビゲーション先がハードコード。ユーザー入力由来のURLへの遷移なし |
| シークレット管理 | 良好 | サーバーサイドシークレットなし。`.env.local` は `.gitignore` に含まれている |
| 依存パッケージ | 良好 | 最小限の依存。`npm audit` で定期確認推奨 |

### アプリ側の対策

| 項目 | 対策 |
|------|------|
| X-Powered-By | `next.config.js` で `poweredByHeader: false` |
| window.open() opener保護 | 第3引数に `noopener,noreferrer` を指定 |

### 推奨設定（Cloudflare側）

| 優先度 | 項目 | 対策 |
|--------|------|------|
| 高 | セキュリティヘッダー | Cloudflare Transform Rules で設定（下記参照） |
| 中 | WAF / Bot Fight Mode | カスタムドメイン設定後にダッシュボードで有効化 |
| 中 | レートリミット | 必要に応じて設定（パーソナリティチェックアプリなので低優先） |

## 対策: X-Powered-By 除去

### `next.config.js`

```js
poweredByHeader: false  // X-Powered-By: Next.js を除去
```

## 対策: window.open() opener保護

### `src/app/result/[type]/ResultClient.tsx`

```js
window.open(url, "_blank", "noopener,noreferrer,width=550,height=420");
```

## 対策: セキュリティヘッダー（Cloudflare Transform Rules）

opennextjs-cloudflare が Next.js の middleware/proxy convention を完全サポートしていないため、
セキュリティヘッダーは **Cloudflare Transform Rules** で設定する方針。

### 設定すべきヘッダー

| ヘッダー | 値 | 目的 |
|----------|-----|------|
| `X-Content-Type-Options` | `nosniff` | MIMEタイプスニッフィング防止 |
| `X-Frame-Options` | `DENY` | クリックジャッキング防止 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | リファラー情報の制御 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | 不要なブラウザAPI無効化 |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HTTPS強制 |
| `Content-Security-Policy` | 下記参照 | リソース読み込み制御 |

### CSP ポリシー

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

| ディレクティブ | 理由 |
|----------------|------|
| `script-src 'unsafe-inline'` | Next.js ハイドレーション用インラインスクリプト |
| `script-src https://static.cloudflareinsights.com` | Cloudflare Web Analytics ビーコン |
| `style-src 'unsafe-inline'` | Tailwind CSS がインラインスタイルを使用 |
| `font-src 'self'` | `next/font/google` がビルド時にセルフホスト。外部CDN不要 |
| `connect-src 'self'` | 外部APIへの接続なし |
| `img-src data:` | Base64画像（キャンバス描画等） |
| `frame-ancestors 'none'` | X-Frame-Options の CSP版（新しいブラウザ向け） |

## 対策: Cloudflare側（ダッシュボード設定）

以下をダッシュボードで推奨:

- **SSL/TLS**: Full (strict) モード
- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON
- **DDoS Protection**: 自動有効（Free プランで十分）
- **Bot Fight Mode**: ON（推奨）
- **Rate Limiting**: 必要に応じて設定（無料プランでは制限あり）
- **WAF**: Managed Rules の Free 枠を有効化

## 運用ガイドライン

- `npm audit` を定期実行（月1回目安）
- 依存パッケージのアップデート時にセキュリティアドバイザリを確認
- CSP違反が発生した場合はブラウザコンソールで確認し、ポリシーを調整
- 新しい外部リソース（スクリプト・API・CDN）追加時はCSPの更新を忘れずに
