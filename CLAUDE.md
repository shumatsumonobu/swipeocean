# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドです。

## コマンド

```bash
npm run dev         # 開発サーバー起動 (node_modules自動判定付き、HMR付き)
npm run build       # Next.js ビルド（cf:deploy/preview が内部で使用）
npm run lint        # ESLint
npm run cf:preview  # Workers 用ビルド → ローカル起動（WSL経由、一発実行）
npm run cf:deploy   # Workers 用ビルド → Cloudflare にデプロイ（WSL経由、一発実行）
```

テストフレームワークは未導入。

## アーキテクチャ

Swipe Ocean は Big Five（OCEAN）ベースのパーソナリティチェックアプリ。コアバリューは「今日のキミを肯定する。気が向いたら、また。」（詳細は `docs/concept.md`）。画像を左右にスワイプし、クライアント側でスコアを算出、8つのパーソナリティタイプのいずれかを判定する。どのタイプにも良いところがあり、パーソナリティを評価・判定するのではなく「今の自分」を肯定する体験を提供する。

**技術スタック:** Next.js 16 (App Router) + React 19 + Tailwind CSS 3 + TypeScript (strict)

**デプロイ:** Cloudflare Workers（`@opennextjs/cloudflare` + `wrangler`）— `npm run cf:deploy` で WSL 自動呼び出し（Windows では `resvg.wasm?module` のファイル名制約でエラーになるため）

**本番 URL:** https://swipeocean.surf

**パスエイリアス:** `@/*` → `./src/*`

### ユーザーフロー & データパイプライン

1. **トップ** (`/`) — 「やってみる！」CTAでスタート
2. **スワイプ** (`/swipe`) — 80枚から特性ごとに均等（5特性 × high/low バランス考慮）に10枚選出（1特性2枚）。左スワイプ="今はちがう"、右スワイプ="今の私っぽい"。結果は `localStorage` に `swipeResults` と `selectedImages` として保存
3. **結果リダイレクト** (`/result`) — localStorage から結果を読み取り、特性ごとのスコア（0〜1）を算出、`determinePersonalityType()` でタイプ判定後、`/result/[type]` にリダイレクト
4. **結果詳細** (`/result/[type]`) — サーバーコンポーネントでOGPメタデータ生成、クライアントコンポーネントでレーダーチャート・スコア・あるある・おすすめ・キャラクター・シェアボタンを表示。あるある・おすすめはデータプールからランダム選出（表示ごとに変化）

### スコア計算 & タイプ判定

スワイプ結果からクライアント側で5特性スコア（0〜1）を算出し、閾値ベースで8タイプに判定。ロジックは `src/app/result/page.tsx`（スコア計算）と `src/data/personalityTypes.ts`（`determinePersonalityType()`）。仕様は `docs/spec.md`。

### 多言語対応パターン

クライアント側のみ。各ページで `translations` オブジェクト（`ja` / `en` キー）を定義。言語設定は `?l=en` クエリパラメータで制御（デフォルトは `ja`）。切替ボタンは遷移先の言語名をその言語で表示（"English" / "日本語"）。パラメータは `langParam` 変数パターンで画面遷移時に引き継がれる。

### 主要データファイル

- `src/data/images.json` — 画像80枚（5特性 × 2方向 × 8枚）のメタデータ（id, src, trait, direction）。画像は `public/images/swipe/` に配置
- `src/data/personalityTypes.ts` — 8タイプの定義（名前・説明・アドバイス・あるある・おすすめ、日英対応）+ `determinePersonalityType()` 判定関数
- `src/types/index.ts` — 全TypeScript型定義（`ImageMeta`, `SwipeResult`, `CheckScores`, `PersonalityType` 等）

### 結果ページの機能

- **ランダム表示:** あるある・おすすめをプールからランダム選出（表示ごとに変化）
- **シェア導線:** 結果は `/result/[type]` をXシェア（OGP展開）。シェアリンク流入者には「自分もやってみる！」CTA → `/?friend={typeId}` でホーム誘導（`personalityTypes` キーでホワイトリスト検証）


### OGP画像

タイプ別の静的OGP画像（1200×630 PNG）を `public/images/ogp/` に配置。Cloudflare Workers では `next/og` が動作しないため、`scripts/gen-ogp.mjs` でローカル生成（詳細は `docs/design/ogp.md`）。

### キャラクター

- **キャラクター:** `public/images/characters/type_{type}.png`。設計は `docs/design/character.md`

### Dev Mode

URLに `?dev=1` を付与すると有効化。結果ページにタイプ切替ドロップダウンが表示される。パラメータは `devParam` 変数パターンで画面遷移時に引き継がれる。

## UI文言ガイドライン

ターゲットは10〜20代の若年層。「やってみたい！」と思える親しみやすさが最優先。

### 日本語

- **口調:** 気楽な友達のタメ口。敬語（〜です/ます/〜してください）は使わない。堅い説明文・学術的な表現はNG
  - OK: `直感でいこ！` / NG: `直感で選んでください`
  - OK: `おつかれ！` / NG: `おつかれさまでした`
- **言い切り（最重要）:** **端的に言い切る**。語尾の「だよ／だよね／よ／ね／〜かな／〜ちゃう／〜かも／〜からね／〜だったりしない？」は基本カット → 言い切り（。）か体言止めでズバッと。軟弱・回りくどい・ヘッジ表現はNG（なよなよさせない）
  - OK: `その好奇心がキミの原動力。` / NG: `好奇心がキミの原動力だよね`
  - OK: `決めたらやり切る。計画して、コツコツ続ける力。` / NG: `コツコツ頑張れるかのスコアだよ`
- **短く・パンチ・直感的:** 1文を短く。「才能」→「武器」のようにズバッと刺さる言葉を選ぶ。回りくどさを削る
  - OK: `自由な発想は、キミだけの武器。` / NG: `その自由な発想は、キミにしかない才能だよ`
- **ひらがな多め:** 漢字を使いすぎない。柔らかい印象のためにひらがなを優先する
  - OK: `今はちがう` / NG: `当てはまらない`
- **記号・感嘆符:** 「！」「？」を活かしてテンポよく。キミ呼びは維持
  - OK: `タイプ判定！` / NG: `タイプ判定`
  - OK: `Big Five（OCEAN）ってなに？` / NG: `Big Five（OCEAN）理論とは`

### 英語

- **口調:** カジュアル・フレンドリー。SNS投稿のようなテンション
  - OK: `Go with your gut!` / NG: `Please select intuitively`
  - OK: `That's me!` / NG: `This matches my personality`
  - OK: `Your swipes do the rest` / NG: `Your responses will be analyzed`
- **短くてキャッチー:** 文より句、フレーズ重視
  - OK: `Try again` / NG: `Take the test again`
  - OK: `Getting ready...` / NG: `Please wait while we prepare`

### 共通ルール

- personalityTypes.ts のタイプ説明文（descriptionJa/En, adviceJa/En, scenariosJa/En）も同じトーンを維持
- 専門用語（Big Five, OCEAN）はそのまま使うが、説明は噛み砕く
- neuroticism は「神経症的傾向」ではなく「繊細性」、英語も "Sensitivity" と表記

## デザイン

When building, restyling, auditing, or reviewing a screen, follow the design-discipline skill, and speak to me in Japanese, in です・ます form.

- 見た目の決定は `.design/declaration.md`（色・書体・余白・角丸・テーマ数の宣言。置き場はスキルの既定）。まだ無いので、次に画面を触るとき `/design-discipline-init` を1回実行して作る（宣言は subject から導かれ、コードの既存値は照合されて違いが record に残る）。以後のセッションはそれを読んで作る
- 画面ができたら `/design-discipline-inspect` で修理リストを出し、`/design-discipline-fix` で消化する
- スキル本体は `.claude/skills/design-discipline/`（エントリは init / review / inspect / fix の4つ）。隣の `frontend-design` は配色・書体の判断層で、無いと design-discipline が動かないので消さない

## Git ルール

- コミットメッセージに `Co-Authored-By: Claude` を入れない
- コミットメッセージは英語で書く

## コーディング規約

- **ボタン:** すべて `rounded-full`。明示的な指示がない限り border-radius を変更しない。
- **フォント:** Zen Maru Gothic（Google Fonts）をグローバル適用。
- **カラーテーマ:** プライマリUIはシアン→ブルーのグラデーション。各タイプ固有のアクセントカラーは `personalityTypes.ts` で定義。
- **ログ:** `console.log` / `console.error` 等のメッセージはすべて英語で書く（Cloudflare ダッシュボードでの文字化け防止、他ライブラリのログとの統一）。
- **状態管理:** 外部ライブラリ不使用。React hooks + localStorage のみ。
- **ドキュメント:** `docs/` に日本語で格納。構成は `docs/README.md` 参照。`docs/standards.md` の命名規則に従うこと。
- **画像生成:** 設計の総論は `docs/design.md`、アセット別は `docs/design/*.md`。プロンプトは `scripts/prompts/` 配下の JSON で一元管理。
