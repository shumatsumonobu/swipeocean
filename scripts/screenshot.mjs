#!/usr/bin/env node
/**
 * プロモ用スクリーンショット撮影（Playwright）
 *
 * Usage:
 *   node scripts/screenshot.mjs          # ローカル現コードから撮影（dev server 起動が前提）
 *   node scripts/screenshot.mjs --prod   # 本番URL（swipeocean.surf）から撮影
 *
 * 出力: public/screenshots/ 配下（ビューポート = 見えてる範囲のみ）
 * 対象: 結果ページ、レーダーチャート、トップページ（各日英）
 * デフォルトは localhost。デプロイ前に現コードの素材を揃えられる（record-demo.mjs と統一）。
 */

import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public", "screenshots");

const BASE_URL = process.argv.includes("--prod")
  ? "https://swipeocean.surf"
  : "http://localhost:3000";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ページ末尾までスクロールして遅延表示コンテンツをトリガー
async function scrollToRevealAll(page, returnToTop = true) {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 300;
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((s) => window.scrollTo(0, s), y);
    await waitFor(200);
  }
  await waitFor(500);
  if (returnToTop) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await waitFor(500);
  }
}

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // --- 結果ページ（日本語） — ビューポートのみ ---
  console.log("Capturing: result page (ja)");
  await page.goto(`${BASE_URL}/result/explorer?l=ja`, { waitUntil: "networkidle" });
  await waitFor(3000);
  await scrollToRevealAll(page); // 遅延コンテンツをトリガーしてトップに戻る
  await page.screenshot({ path: resolve(OUT_DIR, "result-ja.png") });

  // --- 結果ページ（英語） — ビューポートのみ ---
  console.log("Capturing: result page (en)");
  await page.goto(`${BASE_URL}/result/explorer?l=en`, { waitUntil: "networkidle" });
  await waitFor(3000);
  await scrollToRevealAll(page);
  await page.screenshot({ path: resolve(OUT_DIR, "result-en.png") });

  // --- レーダーチャート部分（結果ページの上部） ---
  console.log("Capturing: radar chart (ja)");
  await page.goto(`${BASE_URL}/result/explorer?l=ja`, { waitUntil: "networkidle" });
  await waitFor(3000);
  await scrollToRevealAll(page);
  await page.screenshot({ path: resolve(OUT_DIR, "radar-chart-ja.png"), clip: { x: 0, y: 0, width: 390, height: 600 } });

  console.log("Capturing: radar chart (en)");
  await page.goto(`${BASE_URL}/result/explorer?l=en`, { waitUntil: "networkidle" });
  await waitFor(3000);
  await scrollToRevealAll(page);
  await page.screenshot({ path: resolve(OUT_DIR, "radar-chart-en.png"), clip: { x: 0, y: 0, width: 390, height: 600 } });

  // --- トップページ — ビューポートのみ ---
  console.log("Capturing: top page (ja)");
  await page.goto(`${BASE_URL}/?l=ja`, { waitUntil: "networkidle" });
  await waitFor(2000);
  await scrollToRevealAll(page);
  await page.screenshot({ path: resolve(OUT_DIR, "top-ja.png") });

  console.log("Capturing: top page (en)");
  await page.goto(`${BASE_URL}/?l=en`, { waitUntil: "networkidle" });
  await waitFor(2000);
  await scrollToRevealAll(page);
  await page.screenshot({ path: resolve(OUT_DIR, "top-en.png") });

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUT_DIR}`);
}

takeScreenshots();
