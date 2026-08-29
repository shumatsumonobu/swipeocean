# UI polish

> 機能は変えず、"触り心地・佇まい" を一段上げるレイヤーの方針。
> Swipe Ocean の世界観（**今を肯定する・遊び心・夜の海**）を手触りで体現する。

UI polish とは「何ができるか」ではなく「どう感じるか」のレイヤー。モーション・タイポgrafィの精度・奥行き・間（ま）など。スワイプ→判定という機能は変えずに、体験の density を上げる。

## 基本方針

polish は世界観の表現手段。足すかどうかは以下の軸で判断する。

| 軸 | OK（採用） | NG（不採用） |
|----|-----------|-------------|
| 方向性 | 遊び・あたたかい・親しみやすい | 高級・クール・無機質 |
| 主張 | さりげなく効く。操作を邪魔しない | 動きが主役になり操作を妨げる |
| 実装 | vanilla CSS + IntersectionObserver + scroll/mouse listener | framer-motion 等の外部アニメlib |
| 過剰さ | トイらしい軽さ。やりすぎない | リッチすぎて重い・うるさい |

**判断の原点:** 主役は「スワイプ体験そのもの」。polish はあくまで調味料。迷ったら引く。

**なぜ無lib:** Cloudflare Workers デプロイでバンドル軽量を維持するため。アプリ全体の方針「外部ライブラリ不使用（React hooks + localStorage のみ）」に準拠（`CLAUDE.md`）。

## 再利用コンポーネント / フック

| 名前 | 役割 | 場所 |
|------|------|------|
| `useFadeIn` | IntersectionObserver ベースのスクロール連動フェードイン | `src/hooks/useFadeIn.ts` |
| `SwipeMarquee` | スクロール連動マーキー（2列逆方向）。資産を「見せる」 | `src/components/SwipeMarquee.tsx` |
| `AnimatedText` | 文字ごとスクロールリビール（opacity 0.2→1） | `src/components/AnimatedText.tsx` |

## 実装パターン

### モーション
- **スクロール連動:** scroll listener（`{ passive: true }`）で位置/進捗を取り、`translateX` や `opacity` に反映。`willChange: 'transform'` で GPU 合成
- **結果リビール（カラーオーラ）:** 結果が出る瞬間に、タイプ色の `box-shadow` グロー＋タイプ名のポップ&発光＋控えめなキラ粒を**一回だけ**協調再生。色は `personalityType.color` 駆動、`prefers-reduced-motion` 対応（`ResultClient.tsx`）。※グローは不透明なキャラ画像の**裏**ではなく `box-shadow` で**外側**に出す（裏だと隠れる）。粒は `--mx/--my` で1粒ずつ軌道を変えて均等並びを避ける
- **入場:** `useFadeIn` + `fade-in-section` / `visible`（`globals.css`）。キャラは固有アニメーション（`characterAnimations.ts`）
- **撤去:** マウス追従マグネット（`Magnet`）は translate 後の矩形を基準に再計算するドリフトバグ＋タッチ非対応のため撤去

### タイポグラフィ
- **流体スケール:** 大きい見出し・タイプ名は `text-[clamp(min, vw, max)]`。モバイルで現状サイズ以上を保証し、大画面でなめらかに拡大（縮小しない設計）
- 例: 結果タイプ名 `clamp(2.5rem, 12vw, 5rem)` / LPセクション見出し `clamp(1.5rem, 5vw, 2.25rem)`

### 奥行き・質感
- **ボタン:** グラデpill に inset shadow でガラス質の立体感（上にハイライト + 下に影）。色は**自前パレット**（violet→indigo / cyan→blue）。ブランド外の色は使わない
- アニメーション（`gentle-pulse` 等）が `box-shadow` を上書きする場合、inset をキーフレームにも焼き込む

### 「show, don't tell」
- 説明の前に世界観を体感させる。例: LPヒーロー直後のスワイプ画像マーキー（80枚の世界観を即座に見せる）

## 適用箇所（現状）

| polish | 適用先 |
|--------|--------|
| スワイプ画像マーキー | LP（`/about`）ヒーロー直後 |
| clamp 流体タイポ | 結果ページのタイプ名、LP見出し |
| カラーオーラ・リビール | 結果ページ（キャラ着地 + グロー + 名前ポップ&発光 + キラ粒） |
| 文字ごとリビール | LP 哲学コピー（philoSub） |
| グラデpill奥行き | トップページ プライマリCTA |

## 注意点

- **やりすぎ注意:** polish は世界観の調味料。主役はスワイプ体験。動きが操作を邪魔したら本末転倒
- **scroll listener の数:** 1ページに複数並ぶと再レンダー負荷が増える。重い要素（多数の `img` 等）は state ではなく `ref` で直接 `transform` を書くことを検討
- **`prefers-reduced-motion`:** 結果リビールは対応済み（粒非表示・名前静的）。他のモーション（マーキー等）は未対応——増やす際は対応を検討
- **横はみ出し対策:** フルブリード（`w-screen`）や `box-shadow` グローは横スクロールを生みうるため、祖先に `overflow-x-hidden` を置く（about・結果ページとも root で担保済み）
