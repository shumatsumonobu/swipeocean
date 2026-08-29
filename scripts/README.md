# scripts/

画像生成・後処理スクリプト群。各スクリプトの詳しい使い方・オプション・ワークフローは [docs/design.md](../docs/design.md) を参照。

## セットアップ

### Node.js

```bash
npm install
```

sharp, commander, @google/genai 等がインストールされる。

### Python（後処理用）

`normalize-character.mjs` が rembg（AI背景除去）を使うため、Python 環境が必要。

```bash
pip install "rembg[cpu]"
```

> Python 3.14 では rembg の依存（`filetype`, `watchdog`）が自動インストールされない場合がある。その場合は `pip install filetype watchdog` を追加実行する。

> Windows で `python` が PATH に通ってない場合でも、`AppData\Local\Programs\Python\` にインストールされていればスクリプトが自動検出する。

### 認証（Vertex AI）

画像生成スクリプト（`gen-character.mjs` 等）は Vertex AI を使用。`scripts/.env` にサービスアカウントJSONのパスを設定する（git管理外）。

```bash
cp scripts/.env.example scripts/.env
# GOOGLE_CREDENTIALS_PATH を実際のパスに書き換える
```

## スクリプト一覧

| スクリプト | 説明 | 外部連携 |
|-----------|------|-----|
| `gen-character.mjs` | キャラクター画像生成（試行＋本番統合） | Vertex AI |
| `gen-swipe.mjs` | スワイプ用画像（80枚）生成 | Vertex AI |
| `gen-app-icon.mjs` | アプリアイコン生成 | Vertex AI |
| `gen-swipe-hints.mjs` | スワイプヒントアイコン生成 | Vertex AI |
| `gen-trait-icon.mjs` | 特性アイコン生成（試行＋本番統合） | Vertex AI |
| `gen-ogp.mjs` | OGP横長背景シーン生成 + テキスト帯合成（`--compose`） | Vertex AI |
| `gen-bg-hero.mjs` | トップページ ヒーロー背景イラスト生成 | Vertex AI |
| `gen-top-ogp.mjs` | トップページ用OGPバナー生成 | Vertex AI |
| `gen-lp-ogp.mjs` | LP（/about）用OGP画像生成（日英2枚） | Vertex AI |
| `deploy-assets.mjs` | 確定済み画像アセットを本番ディレクトリに一括配置 | sharp |
| `utils/normalize-character.mjs` | キャラクター後処理（背景透過→トリミング→600×600中央配置） | rembg (Python) |

> `utils/rembg_remove.py` は `normalize-character.mjs` が内部で呼び出すヘルパー。直接実行しない。

## ディレクトリ構成

```
scripts/
├── .env                  # Vertex AI 認証パス（git管理外、.env.example からコピー）
├── prompts/              # 各スクリプトのプロンプトJSON
│   ├── character/prompts.json
│   ├── swipe-image/prompts.json
│   └── ...
├── characters/           # キャラクター画像（試行 + 後処理結果）
│   ├── references/       # 参考画像
│   ├── explorer-05.png   # 試行画像
│   └── explorer-05-normalized.png  # 後処理済み
├── utils/                # ユーティリティ
└── *.mjs                 # 生成スクリプト
```
