# デモ動画/GIF/スクリーンショット

## 自動録画（Playwright）

```bash
npx playwright install chromium  # 初回のみ
npm run dev                      # 別ターミナルで dev server 起動
node scripts/record-demo.mjs            # スワイプ→結果のデモ（ja/en）→ public/demo-{lang}.webm
node scripts/record-demo.mjs --en       # 英語のみ
node scripts/record-demo.mjs --ja       # 日本語のみ
```

## スクリーンショット

```bash
npm run dev                       # dev server 起動（録画と同じく localhost から撮影）
node scripts/screenshot.mjs       # ローカル現コードから日英6枚（ビューポート＝見えてる範囲のみ）
node scripts/screenshot.mjs --prod  # 本番URL（swipeocean.surf）から撮影
```

デフォルトは localhost なので、**デプロイ前に現コードの素材を揃えられる**（デモ録画と統一）。
対象: 結果ページ・レーダーチャート・トップページ（各日英）。出力先: `public/screenshots/`

## GIF 変換（DevHunt, Dev.to 用）

```bash
cd "$(git rev-parse --show-toplevel)" && WSL_PATH=$(wslpath -a public) && \
MSYS_NO_PATHCONV=1 wsl -- ffmpeg -i "$WSL_PATH/demo-ja.webm" -vf "fps=10,scale=800:-1" -y "$WSL_PATH/demo-ja.gif" && \
MSYS_NO_PATHCONV=1 wsl -- ffmpeg -i "$WSL_PATH/demo-en.webm" -vf "fps=10,scale=800:-1" -y "$WSL_PATH/demo-en.gif"
```

## Small GIF 変換（README 用）

```bash
MSYS_NO_PATHCONV=1 wsl -- bash -c "ffmpeg -i '$WSL_PATH/demo-en.webm' -vf 'fps=6,scale=360:-1,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer' -y '$WSL_PATH/demo-en-small.gif'"
```

## MP4 変換（X 投稿用）

```bash
MSYS_NO_PATHCONV=1 wsl -- ffmpeg -i "$WSL_PATH/demo-ja.webm" -c:v libx264 -pix_fmt yuv420p -y "$WSL_PATH/demo-ja.mp4" && \
MSYS_NO_PATHCONV=1 wsl -- ffmpeg -i "$WSL_PATH/demo-en.webm" -c:v libx264 -pix_fmt yuv420p -y "$WSL_PATH/demo-en.mp4"
```

## 使い回し先

| プラットフォーム | フォーマット | 用途 |
|---|---|---|
| DevHunt | GIF | プロダクトサムネイル |
| Dev.to | GIF | 記事内のデモ画像 |
| Product Hunt | GIF | ギャラリー |
| X | MP4 | 投稿添付動画 |
| Threads | MP4 または画像 | 投稿添付動画 |
| Bluesky | MP4 または GIF | 投稿添付動画 |
