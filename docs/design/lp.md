# ランディングページ（LP）

> Swipe Ocean の世界観とチェックのルールを完璧に伝える「超いかしたLP」。Headspace + Ocean のビジュアル、全8タイプの紹介、スコア計算・タイプ判定ロジックの透明な説明を通じて、「やってみたい！」と思わせるページ。

## デザイン方針

- **ルート:** `/about` — SEOに強く、フッターリンクやシェアの遷移先として自然
- **テーマ:** 夜テーマベース。ダーク最適化アセット＋アプリとの一貫性＋プレミアム感
  - 基本: `#0a0a1f → #16103a → #1e1650`（Hero, Final CTA, あそびかた等）
  - 青寄り: `#0a0f2a → #131a3f`（OCEAN解説）
  - 紫寄り: `#120a25 → #1a1045`（哲学セクション）
  - セクションごとに微妙にgradientを変化させ、「夜の海を旅してる」感覚を作る
- **レイアウト:** モバイルファースト、`max-w-md` 中央配置
- **アニメーション:** `useFadeIn`（スクロール連動）を全セクションに適用。キャラは固有アニメーション
- **多言語:** `translations` オブジェクト（`ja` / `en`）パターン
  - **デフォルト:** 英語（`en`）。LPは海外流入が多いため
  - **クエリパラメータ:** `?l=ja` / `?l=en` でURL指定可能。シェアリンクやSNS投稿で言語を固定できる
  - **優先順位:** `?l=` パラメータ > `localStorage("lang")` > デフォルト `en`
  - **切替ボタン:** 固定右上。切替時は `localStorage` に保存 + URLパラメータも更新
  - **他ページとの連携:** LP で切替えた言語は `localStorage` に保存されるので、アプリ本体にも引き継がれる
- **新規依存なし:** CSS snap カルーセル、Tailwind フローチャート、SVG波線 — すべて既存技術
- **ビジュアル:** アプリ共通アセット（キャラ・背景シーン・特性アイコン・スワイプヒント）で構成。LP専用イラストなし

## レイアウト & UI/UX

### 全体のスクロール体験

LPは1本の「物語」。スクロールするたびに新しい発見がある体験を作る。

```
┌──────────────────────────────┐
│  Hero（100vh）               │ ← 画面いっぱい
│  8キャラ浮遊 + コピー + CTA  │
│  + ソーシャルプルーフ         │
├──── スワイプ画像マーキー ─────┤ ← フルブリード2列・逆方向スクロール連動
│  80枚の世界観を即座に見せる   │   （まず「見せる」。説明より体感）
├──────────────────────────────┤
│  あそびかた 3ステップ         │ ← 「どうやるの？」を先に解消
│  + ミニスワイプ体験           │
│  + 中間CTA                   │
├──────────────────────────────┤
│  8タイプ紹介                 │ ← 操作を知った上で「どれだろう？」
│  カルーセル or グリッド       │
├──── 区切りイラスト ──────────┤ ← nano banana 挿絵でビジュアルブレイク
│  OCEAN 解説                  │ ← O-C-E-A-N 文字演出 → 5カード
├──────────────────────────────┤
│  スコアのしくみ              │ ← インフォグラフィック + 実画像例
│  タイプ判定フローチャート      │
├──── 背景gradient切替 ────────┤ ← 色を微妙に変えてリズム
│  キミはひとつじゃない（哲学）       │ ← 余白多め、大きい文字、詩的
├──────────────────────────────┤
│  Final CTA（100vh）          │ ← 画面いっぱい。全キャラ集合
└──────────────────────────────┘
```

### リズムと余白

- **セクション間:** `py-16`（64px）を基本。Hero と Final CTA は `min-h-screen`
- **セクション内:** 見出し→本文は `mb-3`、本文→要素は `mb-6`
- **2〜3セクションごとにビジュアルブレイク:** イラスト挿絵 or 背景gradient微変化 で「ページを読んでる」ではなく「物語を旅してる」感覚

### タイポグラフィスケール

すべて Zen Maru Gothic。ダーク背景で読みやすいコントラストを確保。

| 用途 | サイズ | ウェイト | カラー |
|------|--------|---------|--------|
| セクション見出し | `clamp(1.5rem, 5vw, 2.25rem)`（24→36px・流体） | `font-bold`（700） | `text-indigo-100` |
| サブ見出し | `text-lg`（18px） | `font-semibold`（600） | `text-indigo-300` |
| 本文 | `text-base`（16px） | `font-normal`（400） | `text-slate-300` |
| 補足・キャプション | `text-sm`（14px） | `font-normal`（400） | `text-slate-400` |
| Hero タイトル | `text-4xl`（36px） | `font-bold`（700） | gradient `from-[#a78bfa] to-[#818cf8]` bg-clip-text |
| Hero サブコピー | `text-lg`（18px） | `font-semibold`（600） | `text-indigo-300` |
| キーメッセージ | `text-lg`（18px） | `font-bold`（700） | `text-violet-300` |
| 哲学セクション大文字 | `text-2xl`（24px） | `font-bold`（700） | `text-indigo-100` |

### カードスタイルバリエーション

全体でガラスカード基調だが、単調にならないよう3種類使い分ける:

| 種類 | スタイル | 使用箇所 |
|------|---------|---------|
| ガラスカード | `bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-5` | あそびかた、OCEAN特性カード、スコア説明 |
| タイプカード（カラー） | `bg-{typeColor}/10 border border-{typeColor}/30 rounded-2xl p-4` | 8タイプカルーセル |
| ハイライトボックス | `bg-violet-500/15 border border-violet-400/30 rounded-xl p-4` | キーメッセージ、補足ボックス |

### インタラクション

| 要素 | 操作 | フィードバック |
|------|------|-------------|
| CTA ボタン | tap/click | `btn-press`（scale down）+ `gentle-pulse` shadow |
| タイプカード | tap | キャラが固有アニメーション実行 + タイプ名表示 |
| カルーセル | swipe/drag | CSS snap でカード中央にスナップ |
| 中間CTA | tap/click | `btn-press` + 遷移 |
| スワイプ画像マーキー | scroll | 2列が逆方向に流れる（スクロール量連動） |
| スワイプ画像例 | tap | 「この画像は○○を測ってるよ！」ツールチップ表示 |

### レスポンシブ

| 要素 | モバイル（〜md） | デスクトップ（md〜） |
|------|----------------|-------------------|
| コンテナ幅 | `max-w-md`（448px） | `max-w-2xl`（672px） |
| あそびかた | 縦積みカード | 3カード横並び |
| 8タイプ | 横スクロールカルーセル | 4×2 グリッド |
| スコア代表2カード | 縦並び | 2カード横並び |
| フローチャート | 縦フロー | 縦フロー（幅広め） |
| Hero キャラ | 小さめ `max-w-[48px]` | やや大きめ `max-w-[64px]` |

### スクロール演出の詳細

単に `useFadeIn`（下からフェードイン）だけだと単調。セクションごとに変化をつける:

| セクション | 演出 |
|-----------|------|
| Hero | マウント時テキスト順次フェードイン。キャラは staggered bounce-pop |
| あそびかた | 各ステップが上から順次フェードイン（200ms ずつ遅延） |
| 8タイプ | カード全体が左からスライドイン |
| OCEAN | 「O-C-E-A-N」各文字が staggered scale-in（弾む感じ）→ 下の5カードが順次フェードイン |
| スコアのしくみ | インフォグラフィックがフェードイン → 実画像例がスライドイン |
| フローチャート | 上から下に順次ノード出現（フローが「流れる」感覚） |
| 哲学 | 見出しはフェードイン。核コピー（philoSub）は文字ごとスクロールリビール（opacity 0.2→1）で「読ませる」 |
| Final CTA | 全キャラが下から一斉に bounce-pop → テキスト・CTA がフェードイン |

## ワクワクギミック

「見るLP」ではなく「体験するLP」にする。スクロールするだけで Swipe Ocean の世界に引き込まれるインタラクション。

### ギミック1: ミニスワイプ体験（Section 2 あそびかた内）

**最重要ギミック。** LP上で実際にスワイプを1〜2枚体験できる。「百聞は一スワイプにしかず」。

- あそびかた Step 1 の直後に、本物のスワイプ画像が1枚表示される
- ユーザーが左右にドラッグ/スワイプできる（既存スワイプページと同じ操作感）
- スワイプすると「今の私っぽい！→ 開放性 +0.1」のようにスコア変動がリアルタイム表示
- 「こんな感じ！もっとやってみる？」→ CTA へ
- **実装:** スワイプページの `react-tinder-card` ロジックを簡略化。1枚だけの軽量版

### ギミック2: ライブレーダーチャート（Section 2 あそびかた内）

- ミニスワイプの結果がリアルタイムでレーダーチャートに反映される
- 初期状態は全スコア 0.5 の正五角形
- スワイプするたびに該当特性のスコアが動いてチャートの形が変わる
- ja: 「たった1枚でも形が変わる！10枚やったらどうなるかな？」
- en: "Just one swipe changes the shape! Imagine what 10 would do?"

### ギミック3: スクロール連動キャラ（グローバル）【未実装・見送り】

> 構想のみ。実装していない。画面を邪魔するリスクと実装コストが高く、ui-polish の「やりすぎ注意」方針とも整合しないため見送り。

（構想）画面右下に小さいキャラ（バランサー）を常駐させ、スクロール位置に応じてリアクションを変える（手を振る／頷く 等）。タップでツールチップ。

### ギミック4: タイプカードフリップ（Section 3 タイプカード内）

- タイプカードをタップすると、そのタイプの「あるある」が1つランダム表示
- 「あ、これ自分かも…？」で興味を引く
- カードの裏面的な演出（flip animation）
- **自動フリップ:** 4秒ごとにランダム1枚が自動フリップ → 2.5秒見せて戻る。タップできることに気づかないユーザーへのデモンストレーション
- **手動タップ:** 自動ローテーションを一時停止。手動で戻した後5秒で自動再開
- **ランダム選出:** 直前と同じカードは避ける

### ギミック5: カウントアップ演出（Section 5 スコア説明内）

- スコア変動の数字（+0.1, -0.05）がカウントアップ/ダウンアニメーションで表示
- スクロールでセクションに到達した瞬間にカウントが走る
- 数字が動くと「おおっ」となる

### ギミック6: SNSシェアプレビュー（Section 8 Final CTA 付近）

10〜20代はシェアが前提。「結果を投稿したらこう見えるよ」を先に見せてFOMOを作る。

- 実際のOGP画像（`/images/ogp/{type}.png`）をスマホのSNS投稿風カードで表示
- ja: 「友達のタイムラインにはこう表示されるよ！」/ en: "This is how it looks on your friends' feed!"
- タイプが3秒ごとに切り替わり、8種類のシェアカードがローテーション
- ja: 「自分のカードが欲しくなる」→ CTA へ / en: "Want your own card?" → CTA

### ギミック7: 「MBTIとどう違うの？」セクション（Section 4 OCEAN解説内）

この世代は MBTI に馴染みがある。MBTI との比較で OCEAN の信頼性を伝える。

- **コピー（ja）:** 「MBTIは知ってる？OCEANは、もっとサイエンスなやつ。しかも結果は今の気分しだい。今のキミが出る！」
- **コピー（en）:** "Know MBTI? Big Five (OCEAN) is actually the more scientifically validated model"
- 比較カード:
  - MBTI: 16タイプ / 固定的 / 二分法（I or E）
  - OCEAN: 連続スコア / 今の状態を測る / グラデーション
- **注意:** MBTIを否定するのではなく「OCEANはもう一つの視点」として紹介

### ギミック8: スクロール進捗バー（グローバル）

- 画面上部に細い（2px）プログレスバー
- スクロールに連動して左→右に伸びる
- **8タイプカラーのグラデーション** で塗られる（0%=explorer青 → 100%=balancerシアン）
- 8色が流れるように表示され、Swipe Ocean の「8色」を体感させる
- 実装コスト極低（CSS + scroll event listener）

### 優先順位

| 優先度 | ギミック | 理由 |
|--------|---------|------|
| ★★★ | ミニスワイプ体験 | コアのアハ体験。これだけで「やりたい！」が生まれる |
| ★★★ | SNSシェアプレビュー | 10〜20代はシェアが行動の起点。FOMO最強 |
| ★★☆ | ライブレーダーチャート | ミニスワイプと組み合わせて初めて真価を発揮 |
| ★★☆ | MBTI比較 | この世代のMBTI知識を活用。信頼性◎ + 親しみ |
| ★★☆ | タイプあるあるチラ見せ | 実装コスト低い。共感で引き込む |
| ★★☆ | スクロール進捗バー | 実装コスト極低。8色体験。スクロール継続を促す |
| ★☆☆ | カウントアップ演出 | 見た目のインパクト。実装も軽い |
| ★☆☆ | スクロール連動キャラ | 楽しいが実装コスト高め。**未実装・見送り** |

## コンテンツファネル

感情 → シンプルさ → ビジュアル → 教育 → 透明性 → 哲学 → 行動

1. **Hero** — 「今日のキミ、どんな色？」+ ソーシャルプルーフで好奇心を刺激
2. **あそびかた** — 「スワイプするだけ」でハードルを下げる + ミニ体験で「簡単じゃん！」→ 中間CTA
3. **8タイプ** — 操作を知った上でキャラを見せて「どれだろう？」を誘発。期待が倍増
4. **OCEAN** — 科学をカジュアルに伝えて信頼を得る + MBTI比較で馴染みを作る
5. **スコアのしくみ** — ロジック完全公開 + 実際のスワイプ画像で裏側を見せて信頼度MAX
6. **キミはひとつじゃない** — 「気分で変わる＝今のキミ」を肯定。恐怖を除去
7. **Final CTA** — 全キャラ集合で送り出し

## セクション詳細

### Section 1: Hero — 感情フック

**トップページとの差別化:** トップは「8体横一列 + ロゴ大 + 即スタート」のリピーター向け構成。LPは「1体のキャラが主役 + ローテーション」で初訪問者の興味を引く構成にする。

- **見出し:** なし（タイトルコピーが見出しを兼ねる）
- **高さ:** フルビューポート（モバイル）
- **背景:** `hero-top.png` opacity 0.18（既存トップページと同じ）
- **キャラ:** **1体を大きく表示。3秒ごとに8タイプが自動ローテーション。** 背景シーン（`type_{id}_bg.png` opacity 0.15）付きカードで世界観を見せる。タイプ固有アニメーション（`typeAnimationName`）付き。タイプ名をキャラの下にタイプカラーで表示
- **8色ドットインジケータ:** キャラカードの下に配置。タップで手動切替 + 5秒後に自動再開
- **テキスト:** キャラの下に配置（トップは上）。順次フェードイン（0.3s, 0.5s, 0.7s stagger）
- **情報の順序:** ロゴ（小）→ キャラ1体（大）→ ドット → タイトル → サブコピー → CTA → 哲学メッセージ

```
┌──────────────────────────────────────┐
│                                      │
│         Swipe Ocean  (小さめロゴ)     │
│                                      │
│     ┌──────────────────────┐         │
│     │   背景シーン薄く      │         │
│     │    🟣 (大きいキャラ)   │         │
│     │   「探求者」Explorer   │         │
│     └──────────────────────┘         │
│   ● ● ● ● ● ● ● ●  (8色ドット)     │
│                                      │
│    今日のキミ、どんな色？            │
│    画像をスワイプするだけ。サクッと10枚。│
│    今の自分がわかるパーソナリティチェック │
│                                      │
│         [ やってみる！ ]              │
│         10枚・サクッと                │
│                                      │
│    どんな結果でもいい。                │
│    気分が変われば、色も変わる          │
│                                      │
└──────────────────────────────────────┘
```

**コピー（ja）:**
```
今日のキミ、どんな色？

画像をスワイプするだけ。サクッと10枚。
今の自分がわかるパーソナリティチェック
どんな結果でもいい。気分が変われば、色も変わる。
```

**コピー（en）:**
```
What color are you today?

Just swipe images. 10 cards, that's it.
A personality check that shows today's you.
Whatever you get, it's all good. Your mood shifts, your color shifts.
```

**CTA:**
- プライマリ: 「やってみる！」（下に小さく「10枚・サクッと」）/ "Try it!" (10 cards · quick) → `/swipe`（gradient + gentle-pulse）

**キャラカード仕様:**

| 項目 | 値 |
|------|-----|
| カードサイズ | `w-40 h-40 sm:w-48 sm:h-48` |
| カード背景 | `type_{id}_bg.png` opacity 0.15 + タイプカラー `{color}10` |
| カード枠 | `border border-{color}30 rounded-2xl` |
| キャラ画像 | `w-28 h-28 sm:w-32 sm:h-32` 中央配置 |
| タイプ名 | キャラ下、タイプカラー、`text-sm font-bold` |
| アニメーション | `typeAnimationName[typeId]` 固有アニメーション |
| 切替 | opacity transition `duration-500` でフェード |

**ローテーション仕様:**
- 自動: 3秒間隔で `heroTypeIdx` を +1（mod 8）
- 手動: ドットタップで切替 + `heroPaused = true` + 5秒後に自動再開
- state: `heroTypeIdx`, `heroPaused`

### Section 1.5: スワイプ画像マーキー — まず「見せる」

Hero 直後にフルブリードで挿入。**説明の前に世界観を体感させる**「show, don't tell」の役割。

- **構成:** スワイプ画像80枚のうち先頭21枚を2列に分割（上段11 / 下段10）。各列を3回繰り返して継ぎ目なくループ
- **動き:** ページのスクロール量に連動。上段が右へ、下段が左へ流れる（逆方向で奥行き感）。`scroll listener + translateX(calc(-33.333% ± offset))`。framer-motion 不使用
- **タイル:** `130px`（sm: `160px`）四方、`rounded-2xl object-cover`、lazy load
- **エッジ:** 左右を `mask-image` のグラデーションでフェードアウト（バンドが自然に溶ける）
- **実装:** `src/components/SwipeMarquee.tsx`（自己完結コンポーネント）

### Section 2: あそびかた — 3ステップ + ミニ体験

- **見出し（ja）:** 「あそびかた」
- **見出し（en）:** "How It Works"

「どうやるの？」を先に解消。操作の簡単さを伝えてハードルを下げる。

3枚の縦カード + ステップ間を波線SVGで接続（`stroke-dashoffset` アニメーション）。

| Step | タイトル（ja） | タイトル（en） | ビジュアル | テキスト（ja） | テキスト（en） |
|------|-------------|-------------|----------|-------------|-------------|
| 1 | スワイプするだけ | Just Swipe | `swipe-left.png` + `swipe-right.png` 並列 | 画像を見て、直感で右か左にスワイプ。考えなくてOK！ | See an image — swipe right or left by instinct. No thinking needed! |
| 2 | パターンを読みとる | Your Vibe, Decoded | 5特性アイコン五角形配置 + 接続線 | キミのスワイプパターンから、5つの特性がわかるよ | Your swipe patterns reveal 5 personality traits |
| 3 | 今日のキミのタイプ！ | Today's You! | ミニレーダーチャート + サンプルキャラ | 8つのタイプから、今のキミにぴったりの結果をお届け！ | Get matched with one of 8 types that fits today's you! |

**★ ミニスワイプ体験（ギミック1+2）:**
Step 1 の直後に挿入。実際のスワイプ画像1枚が表示され、左右にドラッグできる。
スワイプ結果がその場でライブレーダーチャートに反映される。
- ja: 「こんな感じ！もっとやってみる？」→ CTA へ
- en: "That's how it works! Want to try the full thing?" → CTA

**中間CTA（セクション末尾）:**
- ja: 「もう始めちゃう？」/ en: "Ready to start?"
- → `/swipe`
- スタイル: テキストリンク風（`text-indigo-300 underline`）、gentle-pulse なし、控えめだが目に入る

### Section 3: 8タイプ紹介 — ビジュアルの華

- **背景:** 基本gradient `#0a0a1f → #16103a → #1e1650`

操作方法を知った上で見るから「どれだろう？」の期待が倍増。

- **見出し（ja）:** 「8つのタイプ、ぜんぶいい」
- **見出し（en）:** "8 Types — All Good"
- **副題（ja）:** 「キミはどれだろう？」
- **副題（en）:** "Which one are you?"

**レイアウト:**
- モバイル: 横スクロールカルーセル（CSS `scroll-snap-type: x mandatory`、`snap-align: center`）、ドットインジケータ
- デスクトップ（md+）: 4×2 グリッド

**カード構成（タイプカード `bg-{typeColor}/10 border border-{typeColor}/30 rounded-2xl p-4`）:**
1. 背景シーン画像（`type_{id}_bg.png`、opacity 0.15）
2. キャラ画像（中央、タイプ固有アニメーション付き）
3. タイプ名（固有カラー、例: 「探求者」in `#3b82f6`）
4. 一行タグライン（`descriptionJa/En` の1文目）
5. **タップで裏面** → あるある1つをランダム表示（ギミック4）
6. タイプカラーのボトムバー

### Section 4: Big Five（OCEAN）ってなに？ — 科学をカジュアルに

- **見出し（ja）:** 「Big Five（OCEAN）ってなに？」
- **見出し（en）:** "What's Big Five (OCEAN)?"
- **背景:** 青寄り gradient `#0a0f2a → #131a3f`
- **導入（ja）:** 「心理学で最も信頼されているパーソナリティモデル。5つの特性のバランスで、今のキミの「色」がわかるよ」
- **導入（en）:** "The most trusted personality model in psychology. Your balance across 5 traits reveals your current color"

**O-C-E-A-N 文字表示:** 各文字を特性カラーで表示（O=パープル, C=グリーン, E=オレンジ, A=ピンク, N=ブルー）。stagger scale-in アニメーション。

**5特性カード（`traitInfo` データ再利用）:**

| 特性 | アイコン | カラー |
|------|---------|--------|
| 開放性 / Openness | `trait_openness.png` | `#a855f7` |
| 誠実性 / Conscientiousness | `trait_conscientiousness.png` | `#22c55e` |
| 外向性 / Extraversion | `trait_extraversion.png` | `#f97316` |
| 協調性 / Agreeableness | `trait_agreeableness.png` | `#ec4899` |
| 繊細性 / Sensitivity | `trait_neuroticism.png` | `#3b82f6` |

各カード: アイコン + 名前 + カジュアルな説明（`traitInfo.descJa/En`）

**キーメッセージボックス（ja）:** 「スコアに「いい」「悪い」はないよ。全部キミの個性！」
**キーメッセージボックス（en）:** "No score is good or bad — they're all part of what makes you, you!"

**★ MBTI比較（ギミック7）:**

2枚の比較カードを横並び。MBTIを否定せず「もう一つの視点」として紹介。

| | MBTI | OCEAN |
|---|---|---|
| タイプ数 | 16（固定ラベル） | グラデーション（連続スコア） |
| 測るもの | 性格タイプ | 今の気分・状態 |
| 結果 | いつも同じ | 今の気分しだい |
| 科学的信頼性 | △ 再現性に課題 | ◎ 心理学で最も検証済み |

**コピー（ja）:** 「MBTIは知ってる？OCEANは、そのさらに科学的な版。しかも結果は今の気分しだい。今のキミが出る！」
**コピー（en）:** "Know MBTI? OCEAN is the scientifically validated version. And it reads your mood right now — this is you today."

### Section 5: スコアのしくみ — チェックロジック完全公開

- **見出し（ja）:** 「スコアのしくみ — ぜんぶ見せます！」
- **見出し（en）:** "How Scoring Works — Full Transparency!"
- **背景:** 基本gradient `#0a0a1f → #16103a → #1e1650`

#### 5a: スワイプでスコアが動く / How Swipes Change Your Score

代表2パターンをカード形式で表示（「今の私っぽい！→ 大きく動く」「今はちがう → ちょっと動く」）。各カードにスワイプ方向アイコン + 矢印 + スコア変動値。裏のロジックは下表の4パターン（正負の両方向）。

| スワイプ | 方向 | 効果 | 矢印サイズ |
|---------|------|------|-----------|
| 今の私っぽい（→） | high | +0.1 | 大きい緑↑ |
| 今の私っぽい（→） | low | −0.1 | 大きい赤↓ |
| 今はちがう（←） | high | −0.05 | 小さい赤↓ |
| 今はちがう（←） | low | +0.05 | 小さい緑↑ |

**補足（ja）:** 「「今の私っぽい！」の方が影響が大きいよ。直感でえらんだ答えが、キミのスコアをつくる！」
**補足（en）:** "'That's me!' swipes have bigger impact. Your gut feelings shape your scores!"

#### 5b: この画像、なにを見てるの？ / What's Behind Each Image?

実際のスワイプ画像を使って、各画像がどの特性のどの方向を測定しているかを具体的に見せる。ブラックボックス感をゼロにして信頼度を最大化。

**構成:** 実際のスワイプ画像3〜4枚をピックアップし、各画像に以下のラベルを付けて表示:
- 画像サムネイル（`public/images/swipe/` から）
- 特性名（カラー付き）
- 方向（high / low）
- 「→にスワイプすると開放性 +0.1」のような具体的な計算例

**例（ja）:**
```
🖼️ [宇宙を眺める画像]
   開放性 × high方向
   →にスワイプ（今の私っぽい）→ 開放性 +0.1
   ←にスワイプ（今はちがう）  → 開放性 −0.05

🖼️ [友達とパーティの画像]
   外向性 × high方向
   →にスワイプ → 外向性 +0.1
   ←にスワイプ → 外向性 −0.05

🖼️ [ひとりで読書の画像]
   外向性 × low方向
   →にスワイプ → 外向性 −0.1
   ←にスワイプ → 外向性 +0.05
```

**例（en）:**
```
🖼️ [Stargazing image]
   Openness × high direction
   Swipe → (That's me!) → Openness +0.1
   Swipe ← (Not me)     → Openness −0.05

🖼️ [Friends at a party]
   Extraversion × high direction
   Swipe → → Extraversion +0.1
   Swipe ← → Extraversion −0.05

🖼️ [Reading alone]
   Extraversion × low direction
   Swipe → → Extraversion −0.1
   Swipe ← → Extraversion +0.05
```

**キーメッセージ（ja）:** 「80枚の画像はすべて、5つの特性のどれかを測ってるよ。ぜんぶ見せちゃう！」
**キーメッセージ（en）:** "Every one of the 80 images measures one of the 5 traits. Full transparency!"

**補足（ja）:** 「同じ特性でも high / low 両方向の画像があるから、バランスよく測れる」
**補足（en）:** "Each trait has both high and low direction images, so the measurement stays balanced"

#### 5c: タイプの決まりかた / How Types Are Determined

フローチャート（Tailwind flexbox + border で構築、画像ではない）:

```
[スコアが 0.6以上 → 「高い」、0.4以下 → 「低い」]
          │
    ┌─────┴─────┐
    │ 複合タイプ  │（先にチェック）
    └─────┬─────┘
    ├── 開放性 HIGH + 外向性 HIGH → 🔴 冒険家
    ├── 誠実性 HIGH + 開放性 LOW  → 🟡 職人
    │
    ┌─────┴─────┐
    │ 単一特性   │
    └─────┬─────┘
    ├── 開放性 HIGH    → 🔵 探求者
    ├── 誠実性 HIGH    → 🟢 計画者
    ├── 外向性 HIGH    → 🟠 社交家
    ├── 協調性 HIGH    → 🩷 協調者
    ├── 繊細性 HIGH    → 🟣 感受者
    │
    └── どれもバランス  → 🩵 バランサー
```

各ノードにキャラアイコン（小）+ タイプカラー。

**補足ボックス（ja）:** 「複合タイプ（冒険家・職人）が先にチェックされるから、2つの特性が合わさった個性がちゃんと拾えるよ」
**補足ボックス（en）:** "Composite types (Adventurer, Craftsman) are checked first, so combined traits are properly captured"

### Section 6: キミはひとつじゃない — 哲学の核心

- **見出し（ja）:** 「キミはひとつじゃない」
- **見出し（en）:** "You're Not Just One Thing"
- **背景:** 紫寄り gradient `#120a25 → #1a1045`

**コピー（ja）:**
```
「性格診断」じゃない。
今の気分を映す、パーソナリティチェック。

月曜の自分と金曜の自分は、ちがって当たり前。
どっちも本当のキミ。
```

**コピー（en）:**
```
This isn't a personality "test."
It's a check-in on your current vibe.

Monday-you and Friday-you can be totally different —
and that's completely fine.
```

### Section 7: Final CTA — コンバージョン

- **背景:** 基本gradient `#0a0a1f → #16103a → #1e1650`
- 8キャラ集合（Hero よりやや大きめ、固有アニメーション付き）
- **コピー（ja）:** 「さあ、キミの色を見つけよう！」
- **コピー（en）:** "Ready to find your color?"
- CTA（Hero と同じ単一パターン）
- **補足:** 「約1分で終わるよ！」/ "Takes about 1 minute!"

**★ SNSシェアプレビュー（ギミック6）:**
Final CTA の直前に配置。実際のOGP画像をスマホのSNS投稿風カードで表示。
- ja: 「友達のタイムラインにはこう表示されるよ！」
- en: "This is how it looks on your friends' feed!"
8タイプのOGPカードが3秒ごとにローテーション → 「自分のカードが欲しくなる」→ CTA へ。

## アニメーション一覧

| セクション | アニメーション | トリガー |
|-----------|-------------|---------|
| Hero キャラ | `bounce-pop` staggered | マウント時 |
| Hero テキスト | fade-in + slide-up | マウント時（0.3s, 0.5s, 0.7s） |
| スワイプ画像マーキー | 2列逆方向 translateX | スクロール連動 |
| CTA ボタン | `gentle-pulse` shadow | 常時 |
| あそびかた | `useFadeIn` stagger | スクロール |
| タイプカード | `useFadeIn` | スクロール |
| タイプキャラ | 固有アニメーション | visible後常時 |
| 接続波線 | `stroke-dashoffset` reveal | スクロール |
| OCEAN文字 | staggered scale-in | スクロール |
| スコア図 | `useFadeIn` | スクロール |
| フローチャート | sequential fade-in（上→下） | スクロール |
| Final CTA キャラ | `bounce-pop` staggered | スクロール |
| スクロール進捗バー | 8色グラデーション伸長 | スクロール連動 |
| ミニスワイプ | ドラッグ追従 + スコアポップ | ユーザー操作 |
| SNSプレビュー | OGPカード crossfade 3秒 | 常時 |
| タイプカード裏面 | flip animation | タップ |

## 再利用する既存資産

| 資産 | ソース |
|------|--------|
| `useFadeIn` フック | `src/hooks/useFadeIn.ts` |
| `fade-in-section` / `visible` CSS | `src/app/globals.css` |
| `btn-press` / `gentle-pulse` | `src/app/globals.css` |
| キャラアニメーション定義 | `src/data/characterAnimations.ts`（`typeAnimationName`, `characterAnimations`, keyframes） |
| レーダーチャートSVG | `src/app/result/[type]/ResultClient.tsx` |
| `traitInfo` データ | `src/data/traitInfo.ts` |
| `personalityTypes` データ | `src/data/personalityTypes.ts` |
| ガラスカード | `bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl` |

## ファイル構成

```
src/app/about/
  page.tsx           — Server component（metadata + OGP）
  AboutClient.tsx    — Client component（全セクション + アニメーション + 言語切替）
src/components/
  SwipeMarquee.tsx   — Section 1.5 スクロール連動マーキー（自己完結）
  AnimatedText.tsx   — 文字ごとスクロールリビール（Section 7 哲学コピーで使用）
```

- **パターン:** `result/[type]/page.tsx` + `ResultClient.tsx` と同じ
- **規模:** ギミック全8個 + 中間CTA + ドットインジケータ

## 画像アセット

### 既存（そのまま使用）

| 用途 | パス |
|------|------|
| キャラクター（8体） | `public/images/characters/type_{typeId}.png` |
| 背景シーン（8体） | `public/images/characters/type_{typeId}_bg.png` |
| ヒーロー背景 | `public/images/bg/hero-top.png` |
| 特性アイコン（5枚） | `public/images/traits/trait_{trait}.png` |
| スワイプヒント（2枚） | `public/images/swipe-hints/swipe-left.png`, `swipe-right.png` |
| スワイプ画像（例示用） | `public/images/swipe/` から3〜4枚ピックアップ |

### LP専用イラスト

不使用。既存アセット（キャラ・背景シーン・特性アイコン等）で世界観が十分伝わるため。

### LP専用OGP

詳細は [`docs/design/lp-ogp.md`](lp-ogp.md) を参照。8体キャラ上部 + コピー下部の構図でトップOGPと差別化。`gen-lp-ogp.mjs` で sharp 合成、日英2枚（about-ja.png / about-en.png）。`generateMetadata` で `?l=` パラメータにより切替。

## トップページからの導線

`src/app/page.tsx` の about セクション（「Swipe Oceanって？」カード内）に「もっとくわしく →」/ "Learn more →" リンク。`text-indigo-300 underline` スタイルで控えめだが目に入る。
