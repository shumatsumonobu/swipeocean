# デプロイ

## 公開 URL

https://swipeocean.surf

## 全体像

```
Next.js アプリ
    ↓  opennextjs-cloudflare build
Workers 用ファイル（.open-next/）
    ↓  wrangler deploy
Cloudflare Workers（エッジサーバー）
```

---

## プロジェクト設定

### wrangler.jsonc

```jsonc
{
  "name": "swipeocean",              // Workers のアプリ名（URLの一部になる）
  "main": ".open-next/worker.js",     // Workers のエントリポイント（ビルドで生成される）
  "compatibility_date": "2026-02-20", // Workers ランタイムのバージョン日付
  "compatibility_flags": ["nodejs_compat"],  // Node.js API を一部使えるようにする
  "assets": {
    "directory": ".open-next/assets",  // 画像・CSS・JSなどの静的ファイル
    "binding": "ASSETS"                // コードから静的ファイルにアクセスするための名前
  }
}
```

### npm スクリプト

```bash
npm run cf:deploy     # WSL経由でビルド→デプロイ（一発実行）
npm run cf:preview    # WSL経由でビルド→ローカル起動（一発実行）
```

| ファイル | 役割 |
|:--|:--|
| `wrangler.jsonc` | Cloudflare Workers の設定 |
| `open-next.config.ts` | opennextjs-cloudflare の設定（デフォルト） |
| `scripts/deploy.sh` / `scripts/preview.sh` | WSL経由のビルド＋デプロイ自動化スクリプト |

`cf:deploy` の内部フロー：
1. WSL内でLinux用node_modulesをクリーンインストール
2. WSL内で opennextjs-cloudflare build
3. WSL内で opennextjs-cloudflare deploy
4. WSL内のnode_modulesを削除
5. Windows用node_modulesを再インストール（ローカル開発に復帰）

---

---

## デプロイ手順（毎回）

dev server を停止してから：

```bash
npm run cf:deploy
```

> **注意:** dev server が起動中だと node_modules の削除に失敗するため、先に停止すること。

---

## ローカル開発 vs デプロイ

| 操作 | 環境 | コマンド |
|:--|:--|:--|
| ローカル開発 | Windows（Git Bash） | `npm run dev` |
| Workers プレビュー | Windows → WSL 自動 | `npm run cf:preview` |
| デプロイ | Windows → WSL 自動 | `npm run cf:deploy` |

すべて Windows の Git Bash から実行可能。WSL への切り替えはスクリプトが自動で行う。

---

## Cloudflare Web Analytics

アクセス解析（ページビュー・訪問者数・リファラー等）。Cookieレス・GDPR準拠。

- **ダッシュボード:** Cloudflare → 分析とログ → Web 分析
- **ホスト名:** `swipeocean.surf`
- **スクリプト:** `src/app/layout.tsx` の `<body>` 末尾にビーコンスクリプト（トークン埋め込み）を配置

---

## ドメイン

| 項目 | 内容 |
|:--|:--|
| ドメイン名 | `swipeocean.surf` |
| レジストラ | Cloudflare Registrar |
| 年額 | $24.20（~¥3,600） |
| 接続先 | Cloudflare Workers（`swipeocean`） |

### なぜ Cloudflare Registrar？

- Workers を使っているので DNS 設定がシームレス
- 原価提供（他のレジストラより安いか同額）
- ドメイン + DNS + Workers が同じダッシュボードで管理できる

### なぜ `.surf`？

- アプリ名 "Swipe Ocean" の海モチーフと完璧に一致
- URL自体が世界観を表現（`swipeocean.surf`）
- SNSシェア時に目を引く珍しいTLD

---

## トラブルシューティング

