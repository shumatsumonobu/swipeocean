#!/usr/bin/env node
/**
 * デモ動画録画スクリプト（Playwright）
 *
 * Usage:
 *   node scripts/record-demo.mjs            # ja/en 両方録画
 *   node scripts/record-demo.mjs --ja       # 日本語のみ
 *   node scripts/record-demo.mjs --en       # 英語のみ
 *
 * 出力: public/demo-{lang}.webm
 * 変換: docs/launch/assets.md の GIF/MP4 変換コマンドを参照
 *
 * 前提: dev server が起動していること（npm run dev）
 */

import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public");

const BASE_URL = "http://localhost:3000";
const CARD_COUNT = 10; // 常時10枚（1特性2枚 × 5特性）

const args = process.argv.slice(2);
const langs = args.includes("--ja")
  ? ["ja"]
  : args.includes("--en")
    ? ["en"]
    : ["ja", "en"];

async function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function recordDemo(lang) {
  const outPath = resolve(OUT_DIR, `demo-${lang}.webm`);
  console.log(`[${lang}] Recording demo → ${outPath}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 サイズ
    deviceScaleFactor: 2,
    colorScheme: "dark",
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 390, height: 844 },
    },
  });

  const page = await context.newPage();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.evaluate(() => document.documentElement.style.backgroundColor = "#0a0a1f");

  // --- トップページ ---
  await page.goto(`${BASE_URL}/?l=${lang}`, { waitUntil: "networkidle" });
  await waitFor(800);

  // メインCTA「やってみる！ / Try it!」をクリック（単一CTA）
  const startBtn = page
    .getByRole("link", { name: lang === "ja" ? "やってみる！" : "Try it!" })
    .first();
  await startBtn.click();
  await page.waitForURL(/\/swipe/);
  await waitFor(1500);

  // --- スワイプ（キーボード操作 — ArrowLeft / ArrowRight） ---
  for (let i = 0; i < CARD_COUNT; i++) {
    // ランダムに左右スワイプ（右多め = 肯定的な結果になりやすい）
    const key = Math.random() < 0.65 ? "ArrowRight" : "ArrowLeft";
    await page.keyboard.press(key);
    await waitFor(600);
  }

  // --- 結果ページ ---
  // 結果ページへのリダイレクトを待つ
  await page.waitForURL(/\/result\//, { timeout: 15000 });
  await waitFor(2200); // 結果リビール演出（グロー＋名前ポップ＋粒, ~1.9s）を見せきる

  // ゆっくりスクロールして結果を見せる
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 844;
  const scrollSteps = Math.ceil((scrollHeight - viewportHeight) / 200);

  for (let i = 0; i < Math.min(scrollSteps, 8); i++) {
    await page.evaluate((y) => window.scrollBy(0, y), 200);
    await waitFor(800);
  }

  await waitFor(2000);

  // --- 録画停止 ---
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const tempPath = await video.path();
    // Playwright が生成した一時ファイルをリネーム
    const { renameSync } = await import("fs");
    try {
      renameSync(tempPath, outPath);
      console.log(`[${lang}] Done: ${outPath}`);
    } catch (e) {
      console.log(`[${lang}] Video saved at: ${tempPath}`);
      console.log(`[${lang}] Please rename to: ${outPath}`);
    }
  }
}

// 実行
for (const lang of langs) {
  await recordDemo(lang);
}

console.log("\nAll recordings complete!");
console.log("Next steps (see docs/launch/assets.md for details):");
console.log("  GIF:       wsl -- ffmpeg -i demo-{lang}.webm -vf 'fps=10,scale=800:-1' demo-{lang}.gif");
console.log("  Small GIF: wsl -- ffmpeg -i demo-en.webm -vf 'fps=6,scale=360:-1,...palette' demo-en-small.gif");
console.log("  MP4:       wsl -- ffmpeg -i demo-{lang}.webm -c:v libx264 -pix_fmt yuv420p demo-{lang}.mp4");
