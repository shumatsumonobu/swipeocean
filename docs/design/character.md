# キャラクター（8体＋背景8枚）

> 結果ページで表示される8タイプのキャラクター。色＝個性。Headspace風フラットデザイン。

## テーマ

**「きみの色」**

色＝個性。結果ページで「あなたの色はこれ」と伝える。
Swipe Oceanの「Ocean」＝色の深さ・広がりと繋がる。

## デザイン方針

**Headspace風フラットデザイン**

### 参考リンク

- [Headspace Illustration - Pinterest](https://www.pinterest.com/ideas/headspace-illustration/893945749075/)
- [Headspace Characters - Pinterest](https://www.pinterest.com/ideas/headspace-characters/921340020422/)
- [How Headspace Designs for Mindfulness](https://raw.studio/blog/how-headspace-designs-for-mindfulness/)

### デザイン原則

- **シンプルだが個性的:** 幾何学的な形だが、服・靴・頭の形でキャラごとに個性を出す
- **丸い:** 角なし、柔らかい曲線のみ
- **フラット＋多色:** ベクター風のクリーンな塗り。体色＋服の色＋小物の色で2〜3色使う。同系色の濃淡も活用
- **性別不明:** 抽象的な形で性別を感じさせない
- **色で語る:** タイプごとに固有のカラーパレット
- **服を着せる:** 全キャラに何かしら着せる（パンツ、ベスト、ブーツ、マフラー等）。Headspaceのキャラのように服がキャラの一部になる

## 共通仕様

### シルエット

- **目:** 丸い点2つ（白目あり）。balancerのみ目を閉じた表現
- **口:** シンプルな曲線。タイプに合った表情をつける（Headspace風）
- **手足:** **太くて丸みのある手足**（Headspace風）。棒ではなくボリュームがある。タイプごとに太さ・長さが異なる。関節なし。**手（腕）は体色と同じ**（Headspaceの慣例）
- **頭身:** 頭と体が一体化した1〜1.5頭身
- **頭の形:** タイプによってユニークな形（突起、平らな頂点等）
- **輪郭:** なめらかな曲線、角なし
- **服:** 全キャラに着せる。体色と異なる色で、キャラの個性を強調する
- **靴:** 必要なキャラには靴・ブーツを履かせる（足元の色が変わり、ディテールが豊かになる）
- **小物:** タイプの個性を表す0〜1アイテム（harmonizerのように小物なしのキャラもいる）
- **色数:** 体色＋服/靴の色＋小物の色で2〜3色

### 画像仕様

| 項目 | 値 |
|------|-----|
| 生成サイズ | 1024 × 1024 px |
| 本番サイズ | 約 600 × 600 px（リサイズ） |
| 背景 | 白（`#FFFFFF`） |
| 向き | やや斜め |
| フォーマット | PNG |

### シルエット差別化マップ

8体並べた時に一目で区別がつくよう、体型・高さ・幅をすべて変える。

```
           背が高い
              ↑
              |    socialite
              |    🎳 ボウリングピン
              |    （くびれ・最も背が高い）
              |
 細い ←───────┼────────→ 太い
              |
   empath     |    explorer
   💧 しずく   |    ○ まんまる大
              |
   adventurer |    craftsman
   🚀 ロケット |    □ 箱型（小さめ）
              |
              ↓
           背が低い

   planner = ▯ 角丸長方形（縦長・中くらい）
   harmonizer = ⬮ おもち（最も低い・横に広い）
   balancer = 💊 カプセル型（上下対称・中庸）
```

## タイプ別設計

### explorer（探求者・開放性↑）

> **「最初の発見者」**

| 項目 | 値 |
|------|-----|
| カラー | ターコイズ `#2DD4BF` |
| カラーの意味 | 未知の海、好奇心 |
| 体型 | **まんまる大。** 大きな円ベース、好奇心の塊がそのまま形になったような丸さ |
| 頭の形 | **目立つサイズのアンテナ1本。** 好奇心の探知アンテナ。シルエットでも分かるサイズ |
| 手足 | **太めの手足（アクティブ）。** ボリュームのある丸い手足、エネルギッシュ |
| 服 | **探検家ベスト（袖なし）。** ダークターコイズで体色との濃淡差 |
| 靴 | **ダークターコイズのブーツ。** ベストと同色系で統一感 |
| 色使い | ターコイズ（体）/ ダークターコイズ（ベスト・ブーツ）/ 茶（望遠鏡） |
| 表情 | 口を開けたワクワク顔（open-mouth excited smile）— 新しいものを見つけた瞬間の興奮 |
| 小物 | 望遠鏡（手に持って覗く） |
| ポーズ | 望遠鏡を覗きながら斜め上を見てる |
| 背景シーン | 崖の上から海を見渡す — ターコイズの海と淡い空、遠くに島のシルエット。「まだ誰も知らない島を見つけた瞬間」 |

### planner（計画者・誠実性↑）

> **「天才軍師」**

| 項目 | 値 |
|------|-----|
| カラー | グリーン `#22C55E` |
| カラーの意味 | 知性、成長 |
| 体型 | **角丸長方形。** 安定感のある縦長ベース、堅実さ・信頼感 |
| 頭の形 | 平らな頂点（本・ノートのイメージ） |
| 手足 | **やや細めの手足（知的）。** ボリュームはあるが他より細め |
| 服 | **チェック柄のベスト。** ダークグリーンのチェック柄で、計画好きの規則正しさ・きちんとした身なりを表現 |
| 靴 | **ダークグリーンの靴。** ベストと同色系で統一感 |
| 色使い | グリーン（体）/ ダークグリーン（チェック柄ベスト・靴）/ ベージュ（クリップボード） |
| 表情 | 満足げなニコニコ（content happy smile）— 完璧な計画ができた時の充実感。「任せて！」という頼もしさ |
| 小物 | クリップボード（片手に持つ、計画・チェックリストの象徴） |
| ポーズ | クリップボードを見ながらニコニコ。もう片手はあごに当てて考え中 |
| 背景シーン | 大きな木の下で計画中 — 草原の一本木の根元、木漏れ日とグリーンのレイヤー。「完璧な計画がひらめいた午後」 |

### socialite（社交家・外向性↑）

> **「生まれながらのリーダー」**

| 項目 | 値 |
|------|-----|
| カラー | サンセットオレンジ `#F97316` |
| カラーの意味 | 太陽、エネルギー |
| 体型 | **ボウリングピン型。** 上部に丸い頭、中間に控えめなくびれ（首が長く見えないよう注意）、下部にやや広がるボディ。8タイプで一番背が高い。存在感・カリスマ |
| 頭の形 | **王冠っぽい突起。** シルエットでも分かるサイズ（参考: Headspaceのクラウンヘッド） |
| 手足 | **長い手足（スタイリッシュ）。** ボリュームのある長い手足、モデル的存在感 |
| 服 | **ボーダーTシャツ。** 濃オレンジのボーダー柄（参考: Headspaceのオレンジ瞑想キャラ） |
| 靴 | **スニーカー。** 濃いオレンジでカジュアルおしゃれ |
| 色使い | サンセットオレンジ（体）/ 濃オレンジ（ボーダーシャツ・スニーカー）/ **黄色（メガフォン）** — 差し色で3色目 |
| 表情 | 満面の笑み、口を大きく開けて笑ってる（wide open-mouth laugh）— 8体の中で最大の笑顔！パーティーの中心 |
| 小物 | メガフォン（拡声器、大きめでシルエット映え） |
| ポーズ | メガフォンを口元に当てて叫んでる、もう片手を高く上げてみんなを盛り上げてる |
| 背景シーン | 青空の街でパレード — 真っ青な空にカラフルなフラッグガーランドと気球、街並みのシルエット。8体の中で唯一の「真っ昼間」。「この子が来ると街がお祭りになる」 |

### harmonizer（協調者・協調性↑）

> **「みんなが頼る人」**

| 項目 | 値 |
|------|-----|
| カラー | ソフトピンク `#F9A8D4` |
| カラーの意味 | 優しさ、安心 |
| 体型 | **平たいおもち。** 8タイプで最も低く横に広い。ぬいぐるみのような安心感 |
| 頭の形 | ふんわり丸い（おもち体型と一体化、最もシンプル） |
| 手足 | **短くてまるい手足（ぷにぷに）。** ボリュームのある丸い手足、ぬいぐるみ感 |
| 服 | **マフラー/ストール。** 濃いピンクで包み込む温かさ |
| 靴 | なし（短い足はそのまま＝ぬいぐるみ感） |
| 色使い | ソフトピンク（体）/ 濃ピンク（マフラー）/ ほんのりピンクの頬（チーク） |
| 表情 | 穏やかな微笑み（gentle warm smile, closed mouth）— 安心させる優しい笑顔 |
| 小物 | なし |
| ポーズ | 両手を大きく広げてる。ハグしてくれそうな安心感 |
| 背景シーン | 雪がちらつく冬の夕暮れ — ピンクの夕暮れ空、雪の積もった原っぱ、遠くに家の灯り。「寒い日に、この子がいるだけであったかい」 |

### empath（感受者・繊細性↑）

> **「心が見える人」**

| 項目 | 値 |
|------|-----|
| カラー | ラベンダー `#C084FC` |
| カラーの意味 | 繊細、感性 |
| 体型 | **しずく型（teardrop）。** 上が細く（丸みあり）、下にかけてふっくら丸く広がる。水滴のような繊細さ |
| 頭の形 | しずくの先端がなめらかに細くなる（体型と一体化） |
| 手足 | **細くて長めの手足（繊細）。** ボリュームはあるが他より細い、儚さ |
| 服 | **ショートケープ（肩周りのみ）。** **ダークパープル**で体のラベンダーとはっきりコントラストをつける。足元までは垂らさない |
| 靴 | **ダークパープルのシンプルな靴。** ケープと同色で統一 |
| 色使い | ラベンダー `#C084FC`（体）/ **ダークパープル（ケープ・靴）** / **白（蝶）** — 3色ではっきりコントラスト。Headspaceのティールキャラ（体＋ダークブルー服）と同じ構造 |
| 表情 | やさしく微笑む（head tilted, soft gentle smile）— 首をかしげて「大丈夫だよ」という安心感。**小さめシンプルな目と口（Headspace風）**。harmonizerの直接的な温かさとは対照的な、静かで繊細なやさしさ |
| 小物 | **明るいピンクの蝶（大きめ、手に止まる）** — ラベンダー＋ダークパープルに対する差し色。白背景で映える色 |
| ポーズ | そっと手を差し出して、蝶が止まっている。静かなやさしさ |
| 背景シーン | 蝶が舞うラベンダーの黄昏 — 薄紫〜ピンクのマジックアワー、一面のラベンダー畑に蝶が舞う。「この子の周りでは、蝶も安心して止まる」 |

### adventurer（冒険家・開放＋外向↑）

> **「一番勇敢な人」**

| 項目 | 値 |
|------|-----|
| カラー | コーラルレッド `#F87171` |
| カラーの意味 | 情熱、勇気 |
| 体型 | **ロケット型（丸い頭＋下がすぼまる）。** 上に向かって飛び出すエネルギー。empathのしずく（上細→下太）と上下反転ペアでシルエット差が明確。小さめ・コンパクトで威圧感なし |
| 頭の形 | **パイロットキャップ（飛行帽）。** 耳当て付きでシルエットに個性を出す。冒険家＝空を飛ぶイメージ |
| 手足 | **太めで短い手足（元気）。** ボリュームのある丸い手足 |
| 服 | **パイロットキャップ（頭）＋スカーフ（首元に短く）。** ダーク赤で冒険の相棒感 |
| 靴 | **ダーク赤のブーツ。** キャップ・スカーフと同色系で統一感 |
| 色使い | コーラルレッド（体、明るく温かい赤）/ ダーク赤（キャップ・スカーフ・ブーツ）/ ベージュ（地図） |
| 表情 | **元気な笑顔**（happy smile）— 「いくぞー！」の元気さ。目は白目あり（白い丸の中に黒い瞳）、**小さめでシンプル（Headspace風）**。口も小さめ。アニメっぽくならないよう顔パーツは控えめに |
| 小物 | 丸めた地図（片手に持つ、冒険の計画） |
| ポーズ | 片手に地図、もう片手を上に突き上げて「いくぞー！」。前のめりの躍動感 |
| 背景シーン | 朝焼けの雲の上に立つ — コーラルレッドの朝焼け、雲の上で遠くを指差す。「朝一番に飛び出して、まだ誰も見てない景色を見つけにいく」 |

### craftsman（職人・誠実＋開放↓）

> **「唯一無二の職人」**

| 項目 | 値 |
|------|-----|
| カラー | レモンイエロー `#FACC15` |
| カラーの意味 | 匠の輝き、ひまわりのような明るさ |
| 体型 | **縦長めの角丸箱型。** スリムでかわいい。plannerとの差別化は頭の突起＋エプロン＋やや幅広めで保つ。**太く見えないよう縦長比率を意識。ごつくしない** |
| 頭の形 | **指みたいな突起。** シルエットでも分かるサイズ（参考: Headspaceのティールキャラ風、職人の手のイメージ） |
| 手足 | **しっかりした手足。** ボリュームはあるがコンパクト、ものを作る力強さ |
| 服 | **エプロン。** ダークイエローで職人感 |
| 靴 | **ダークイエローの靴。** エプロンと同色系で統一感 |
| 色使い | レモンイエロー（体、明るくポップ）/ ダークイエロー（エプロン・靴）/ ダークブラウン（ハンマーの柄のみ） |
| 表情 | 口角を上げた誇らしげな笑み（proud satisfied smile）— 作品完成の充足感 |
| 小物 | 大きめのハンマー（肩に担ぐ、シルエットでもすぐ分かるサイズ） |
| ポーズ | ハンマーを肩に担いで仁王立ち。自信満々 |
| 背景シーン | ひまわり畑に仁王立ち — 一面のひまわり畑、青空と太陽。要素はシンプルに、レモンイエロー×ひまわりの色統一感が主役。「日差しの中で、自分の手でいいものをつくる喜び」 |

### balancer（バランサー・全中間）

> **「万能の人」**

| 項目 | 値 |
|------|-----|
| カラー | スカイブルー `#0EA5E9` |
| カラーの意味 | 穏やか、広い空 |
| 体型 | **カプセル型（pill shape）。** 上下が半円で中間がまっすぐ。完璧に対称な形。「バランス」を形で体現 |
| 頭の形 | きれいな半球（完璧に対称、カプセルの一部） |
| 手足 | **普通の太さの手足（中庸）。** ボリュームはあるが特別でもなく、バランスそのもの |
| 服 | **サッシュベルト（腰の帯）。** ダークブルーの帯がカプセルの真ん中を横切る。帯より下もダークブルー＝上下で色が分かれる。「バランス」を視覚的に体現 |
| 靴 | なし（ダークブルーの下半身が足先まで続く） |
| 色使い | スカイブルー（上半身）/ ダークブルー（サッシュ＋下半身）/ ブルー（天秤） |
| 表情 | 目を閉じた穏やかな微笑み（serene closed-eyes smile）— 8体の中で唯一目を閉じている。禅のような調和 |
| 小物 | 天秤（片手で軽々と持つ、左右均等） |
| ポーズ | 天秤を持ちながら片足立ち。軽やかなバランス感 |
| 背景シーン | 鏡の湖に立つ — 空と水が一体化した上下対称のスカイブルー世界。水面に逆さの自分が映る。「世界の真ん中で、すべてがちょうどいい」 |


## アニメーション

結果ページでキャラクター画像に適用するCSSアニメーション。キャラのパーソナリティ・ポーズ・小物に合った動きを付ける。

| タイプ | クラス名 | 動き | 根拠（キャラ設定） |
|--------|---------|------|------------------|
| explorer | `anim-explorer` | 望遠鏡で辺りを見回す：左右にゆっくり回転 | 望遠鏡を覗いて「次はどこだ？」と探してる |
| planner | `anim-planner` | うなずく：小さく上下 | クリップボードを見ながら「うん、よし」と確認 |
| socialite | `anim-socialite` | ぴょんぴょん跳ねる：上下＋squash | メガフォンで叫びながらジャンプ、パリピ全開 |
| harmonizer | `anim-harmonizer` | おもちのぷるぷる：squash & stretch | おもち体型。ぷにっと押されて戻る弾力感 |
| empath | `anim-empath` | 静かに呼吸する：ゆっくりscale | 繊細で内面的。蝶が飛び立たない静けさ |
| adventurer | `anim-adventurer` | 前のめりに飛び出す：右に傾いて戻る | 「いくぞー！」の前のめりポーズ。勢いと躍動感 |
| craftsman | `anim-craftsman` | ハンマーを打つリズム：トン…トン…と上下 | 規則正しい職人のリズム |
| balancer | `anim-balancer` | 天秤のように揺れる：左右に傾く | 天秤を持って片足立ち。左右均等のバランス感 |

実装: `src/app/result/[type]/ResultClient.tsx` の `typeAnimations`

## カラーパレット一覧

8色が並んだ時にすべて区別がつくことを確認。

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


## 共通プロンプト要件

生成時にコピペで使える共通テンプレート。`{...}` を各タイプの値に置き換える。

### キャラのみ（白背景）

```
Headspace-style flat design character illustration with rich personality details.
Simple geometric shape but with clothing, shoes, and multiple color tones.
Thick rounded limbs with volume (NOT thin stick limbs). Gender-neutral abstract character.
Round dot eyes with white sclera, {表情の英語説明}.

Body shape: {体型の英語説明}
Head shape: {頭の形の英語説明}
Main color: {カラー名} body
Limbs: {手足の英語説明}, thick and rounded with volume, no joints
Clothing: {服の英語説明}
Shoes: {靴の英語説明（なしの場合は「none」）}
Color palette: {色使いの英語説明（体/服/靴/小物の色）}
Expression: {表情の英語説明}
Accessory: {小物の英語説明}
Pose: {ポーズの英語説明}

Clean flat vector style, bold colors, white background, no gradients, no shadows, no black outlines.
Multiple flat color tones — body, clothing, and accessories should be different colors.
```

### キャラ＋背景シーン

結果ページではキャラ＋背景シーンのビジュアルを表示。キャラのみ（白背景）はトップページ等で別途使用。
背景はフラットイラスト調を維持し、Headspaceのようなシンプルな色面構成。各タイプの背景シーンはタイプ別設計を参照。

**生成フロー:** キャラのみ画像を `--reference` に渡し、`{type}-bg` エントリとして prompts.json に記録。試行ファイルは `scripts/characters/{type}-bg-{NN}.png`。

```
Headspace-style flat design illustration with background scene.
Same character as the reference image, placed in a scene.
Keep the character's exact design, color, shape, and expression from the reference.

Scene: {背景シーンの英語説明}
Color palette: {タイプカラー} tones for the background, harmonizing with the character

Flat vector style, bold colors, simple shapes, no realistic textures, no gradients, no shadows.
```

### レビュー観点（背景シーン）

すべて◎を満たすまで再生成する。

| 観点 | 基準 | NG例 |
|------|------|------|
| 色の気持ちよさ | パッと見た瞬間の色彩の美しさ。タイプカラーが最大限映える | くすんだ空、暗い色調、同系色で単調 |
| キャラとの物語性 | 「この子がここで何をしてるか」が伝わる。服装・小物・ポーズとの整合性 | ポーズが設計と違う、小物が欠落、「ぽつんと立ってるだけ」 |
| 世界観の美しさ | 「この世界に入りたい」と思える。壁紙にしたくなる絵 | 要素が多すぎ、寂しすぎ、暗い・怖い印象 |

## レビュー観点

新しいキャラを追加・変更する時に必ず確認する。

- **シルエット差別化:** 8体の影だけで全員見分けがつくか？マップと各タイプの体型記述が一致しているか？
- **カラー一致:** カラーパレット一覧と各タイプのカラーが一致しているか？
- **表情差別化:** 8体すべて異なる感情か？同じ表情のキャラが2体以上いないか？
- **「もらって嬉しい」テスト:** どのタイプになっても嬉しいか？怖い・意地悪・ネガティブな印象のキャラがいないか？
- **背景シーン:** 全タイプに背景シーンが設定されているか？
- **ギャラリーテーブル:** 最新の画像ファイルを参照しているか？

## ファイル構成

すべての画像生成プロンプトは `scripts/prompts/` 配下の JSON で一元管理。


### スワイプ画像（80枚）

> 5特性 × 2方向（High/Low） × 8枚 = 80枚

- **プロンプト・生成設定:** [`scripts/prompts/swipe-image/prompts.json`](../../scripts/prompts/swipe-image/prompts.json)
- **生成スクリプト:** [`scripts/gen-swipe.mjs`](../../scripts/gen-swipe.mjs)
- **格納先:** `public/images/swipe/`

```bash
# 全80枚生成
node scripts/gen-swipe.mjs --force

# 特性で絞り込み（16枚）
node scripts/gen-swipe.mjs --force --trait openness

# 特性+方向で絞り込み（8枚）
node scripts/gen-swipe.mjs --force --trait openness --direction high

# 指定キーのみ
node scripts/gen-swipe.mjs --force openness_high_01 openness_high_02
```


### パーソナリティタイプ キャラクター（8枚）

> 結果画面で表示するタイプ別キャラクター

- **生成スクリプト:** [`scripts/gen-character.mjs`](../../scripts/gen-character.mjs)（プロンプト・パラメータ自動保存）
- **後処理スクリプト:** [`scripts/utils/normalize-character.mjs`](../../scripts/utils/normalize-character.mjs)（背景透過 + トリミング + リサイズ + 中央配置）
- **プロンプト・生成設定:** `scripts/prompts/character/prompts.json`
- **試行ファイル:** `scripts/characters/`（`{type}-{NN}.png` のフラット構造）
- **後処理ファイル:** `scripts/characters/{type}-{NN}-normalized.png`（元ファイルと同じディレクトリ、`-normalized` が付く。`--out` で任意パスも可）
- **参考画像:** `scripts/characters/references/`（Headspace参考画像。`--reference` で指定）
- **格納先:** `public/images/characters/type_{type}.png`

```bash
# 新規生成（プロンプト指定 → prompts.json に自動記録）
node scripts/gen-character.mjs explorer --prompt "Headspace-style..." --temp 0.3

# Headspace参考画像付き
node scripts/gen-character.mjs explorer --prompt "..." --reference scripts/characters/references/fa997687*.jpg

# 再生成（JSON から読み込み）
node scripts/gen-character.mjs explorer

# 後処理（背景透過 + トリミング + 600x600リサイズ）
node scripts/utils/normalize-character.mjs scripts/characters/explorer-05.png

# 確定後、public/images/characters/type_{type}.png に配置
```

### 生成ワークフロー

1. **プロンプト生成:** テンプレートにタイプ別の値を埋めて `gen-character.mjs` で生成
2. **スタイル統一:** `scripts/characters/references/` のHeadspace参考画像を `--reference` で渡して画風を揃える
3. **試行保存:** `scripts/characters/{type}-{NN}.png` に連番で自動保存
4. **レビュー:** デザイン原則・チェックリストで確認
5. **後処理:** `normalize-character.mjs` で背景透過・トリミング・600×600リサイズ（rembg + sharp）
6. **確定・配置:** `public/images/characters/type_{type}.png` に配置

## ギャラリー

### キャラクター

| | | | |
|:--:|:--:|:--:|:--:|
| ![](../../scripts/characters/explorer-05-normalized.png) | ![](../../scripts/characters/planner-05-normalized.png) | ![](../../scripts/characters/socialite-05-normalized.png) | ![](../../scripts/characters/harmonizer-02-normalized.png) |
| explorer | planner | socialite | harmonizer |
| ![](../../scripts/characters/empath-07-normalized.png) | ![](../../scripts/characters/adventurer-23-normalized.png) | ![](../../scripts/characters/craftsman-05-normalized.png) | ![](../../scripts/characters/balancer-03-normalized.png) |
| empath | adventurer | craftsman | balancer |

### 背景シーン

| explorer | planner | socialite | harmonizer |
|:--:|:--:|:--:|:--:|
| ![](../../scripts/characters/explorer-bg-04.png) | ![](../../scripts/characters/planner-bg-02.png) | ![](../../scripts/characters/socialite-bg-01.png) | ![](../../scripts/characters/harmonizer-bg-01.png) |
| explorer-bg-04 | planner-bg-02 | socialite-bg-01 | harmonizer-bg-01 |

| empath | adventurer | craftsman | balancer |
|:--:|:--:|:--:|:--:|
| ![](../../scripts/characters/empath-bg-01.png) | ![](../../scripts/characters/adventurer-bg-29.png) | ![](../../scripts/characters/craftsman-bg-01.png) | ![](../../scripts/characters/balancer-bg-27.png) |
| empath-bg-01 | adventurer-bg-29 | craftsman-bg-01 | balancer-bg-27 |
