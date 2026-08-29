# アセット設計

> 各アセットの詳細設計は個別ファイルを参照。

## サブドキュメント

| ファイル | 内容 |
|---------|------|
| [design/character.md](design/character.md) | キャラクター（8体+背景） |
| [design/swipe-image.md](design/swipe-image.md) | スワイプ用画像（80枚） |
| [design/swipe-hints.md](design/swipe-hints.md) | スワイプヒント（2枚） |
| [design/trait-icons.md](design/trait-icons.md) | 特性アイコン（5枚） |
| [design/app-icon.md](design/app-icon.md) | アプリアイコン |
| [design/ogp.md](design/ogp.md) | タイプ別OGP画像（8枚） |
| [design/top-ogp-banner.md](design/top-ogp-banner.md) | トップOGPバナー |
| [design/lp-ogp.md](design/lp-ogp.md) | LP OGP画像（日英2枚） |
| [design/background.md](design/background.md) | 背景イラスト |
| [design/ui-redesign.md](design/ui-redesign.md) | UIリデザイン |
| [design/ui-polish.md](design/ui-polish.md) | UI polish 方針 |
| [design/lp.md](design/lp.md) | ランディングページ設計 |

## デザイン方針

- **スタイル:** Headspace風フラットデザイン（幾何学的・丸い・影なし・ベタ塗り）
- **テーマ:** 「きみの色」— 色＝個性
- **人物:** なし（スワイプ画像）。キャラクターは抽象的・性別不明
- **生成ツール:** Vertex AI（Gemini 3 Pro Image Preview）

## 画像プール（スワイプ用80枚）

5特性 × 高/低 2方向 = 10パターン × 8枚 = **80枚**

| 特性 | 高（High） | 低（Low） |
|:--|:--|:--|
| Openness | 創造的、好奇心旺盛 | 保守的、伝統重視 |
| Conscientiousness | 計画的、整理整頓 | 自由奔放、柔軟 |
| Extraversion | 社交的、活発 | 内省的、静か |
| Agreeableness | 協力的、思いやり | 競争的、独立心 |
| Neuroticism | 繊細、感受性豊か | 安定、冷静 |

1回のチェックで使用：**10枚**（1特性2枚 × 5特性）

## 画像スタイル

- **スタイル:** シンプルなイラスト調（フラットデザイン / ミニマル）
- **色数:** 限定的（各画像3〜5色程度）
- **線:** シンプルで太め
- **背景:** 単色またはシンプルなグラデーション

### 選定理由

1. **適度な曖昧さ** — 投影法の原理に基づき、解釈の余地を残す
2. **概念（コンセプト）表現** — Visual BFI研究が推奨する方式
3. **文化的中立性** — 英語UIで国際利用を想定
4. **AI生成の安定性** — シンプルなほど品質が安定
5. **ゲーミング防止** — 意図が読み取りにくいため正直な回答を促す

### 参考文献

| 文献 | 内容 |
|:--|:--|
| [PMC/MDPI Journal of Intelligence (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8883940/) | 強制選択型画像テストがBig Five全5特性を従来テストと同等精度で測定可能と検証 |
| [Visual BFI (SpringerLink)](https://link.springer.com/chapter/10.1007/978-3-319-48890-5_10) | 画像は「コンセプト（概念）」を表現すべき。15〜25問で正確に推定可能 |
| [Projective Tests (Simply Psychology)](https://www.simplypsychology.org/what-is-a-projective-test.html) | 投影法テストでは「曖昧さ」が重要 |
| [ACM Transactions (2022)](https://dl.acm.org/doi/10.1145/3503489) | 画像ベーステストは文化・言語バイアスを最小化できる |

## 画像生成ツール

- **ツール:** Vertex AI（Gemini 3 Pro Image Preview）
- **選定理由:** プロンプト遵守性が高い、GC無料枠、フラット系に対応、高速
- **プロンプト管理:** `scripts/prompts/` 配下の JSON で一元管理。`--version` でバージョン切替

## 画像データ

- **メタ情報:** [`src/data/images.json`](../src/data/images.json)（80枚分の id, src, trait, direction）

## カラーパレット

### UIタイプカラー（`personalityTypes.ts` の `color`）

UIのレーダーチャート・スコアバー・キャラクター背景等で使用。

| タイプ | HEX | 色名 |
|--------|-----|------|
| explorer | `#3b82f6` | 青 |
| planner | `#22c55e` | 緑 |
| socialite | `#f97316` | オレンジ |
| harmonizer | `#ec4899` | ピンク |
| empath | `#a855f7` | 紫 |
| adventurer | `#f87171` | 赤 |
| craftsman | `#facc15` | 黄 |
| balancer | `#06b6d4` | シアン |

### OGPテキスト帯カラー（`gen-ogp.mjs` の `CONFIRMED_SCENES`）

OGP画像の下部テキスト帯に使用。UIタイプカラーより明るめ・パステル寄りの色。

| タイプ | カラー名 | HEX | 系統 |
|--------|---------|-----|------|
| explorer | ターコイズ | `#2DD4BF` | 青緑 |
| planner | グリーン | `#22C55E` | 緑 |
| socialite | サンセットオレンジ | `#F97316` | 橙 |
| harmonizer | ソフトピンク | `#F9A8D4` | 桃 |
| empath | ラベンダー | `#C084FC` | 紫 |
| adventurer | コーラルレッド | `#F87171` | 赤 |
| craftsman | レモンイエロー | `#FACC15` | 黄 |
| balancer | スカイブルー | `#0EA5E9` | 青 |


