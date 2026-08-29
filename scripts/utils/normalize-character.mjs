#!/usr/bin/env node
/**
 * キャラクター画像の後処理スクリプト（背景透過 + トリミング + リサイズ + 中央配置）
 *
 * Usage:
 *   node scripts/utils/normalize-character.mjs input.png [--out output.png] [--size 600]
 *
 * 処理:
 *   1. rembg (Python CLI) で背景をAI除去 → 透過PNG
 *   2. sharp.trim() で余白トリミング
 *   3. 指定サイズの透明キャンバスに中央配置（デフォルト 600x600）
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string" },
    size: { type: "string", default: "600" },
  },
});

const input = positionals[0];
if (!input) {
  console.error("Usage: node normalize-character.mjs <input> [--out <output>] [--size <px>]");
  process.exit(1);
}

const absInput = path.resolve(input);
if (!fs.existsSync(absInput)) {
  console.error(`[error] File not found: ${absInput}`);
  process.exit(1);
}

const canvasSize = parseInt(values.size, 10);
const ext = path.extname(absInput);
const base = path.basename(absInput, ext);
const dir = path.dirname(absInput);
const output = values.out ? path.resolve(values.out) : path.join(dir, `${base}-normalized.png`);

console.log(`\n=== Normalize Character ===\n`);
console.log(`  input:  ${absInput}`);
console.log(`  output: ${output}`);
console.log(`  size:   ${canvasSize}x${canvasSize}`);
console.log();

// ── Python 検出 ──────────────────────────────────────────
function findPython() {
  const candidates = ["python", "python3", "py"];
  if (process.platform === "win32") {
    const localPy = path.join(os.homedir(), "AppData", "Local", "Programs", "Python");
    if (fs.existsSync(localPy)) {
      for (const dir of fs.readdirSync(localPy).sort().reverse()) {
        candidates.push(path.join(localPy, dir, "python.exe"));
      }
    }
  }
  for (const cmd of candidates) {
    try {
      execFileSync(cmd, ["--version"], { stdio: "pipe" });
      return cmd;
    } catch {}
  }
  console.error("[error] Python not found. Install Python and ensure it is on PATH.");
  process.exit(1);
}

// ── Step 1: rembg で背景透過 ──────────────────────────────
const tmpFile = path.join(os.tmpdir(), `rembg-${Date.now()}.png`);

try {
  console.log("[1/3] Running rembg...");
  const rembgScript = path.join(__dirname, "rembg_remove.py");
  const python = findPython();
  execFileSync(python, [rembgScript, absInput, tmpFile], {
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120000,
  });
  console.log("      Background removed.");
} catch (err) {
  console.error("[error] rembg failed:", err.stderr?.toString() || err.message);
  process.exit(1);
}

// ── Step 2: trim で余白トリミング ──────────────────────────
console.log("[2/3] Trimming...");

const trimmed = await sharp(tmpFile)
  .trim()
  .toBuffer({ resolveWithObject: true });

const { width, height } = trimmed.info;
console.log(`      Trimmed: ${width}x${height}`);

// tmp ファイル削除
fs.unlinkSync(tmpFile);

// ── Step 3: リサイズ + 透明キャンバスに中央配置 ─────────────
console.log("[3/3] Centering on canvas...");

// キャンバスに収まるようにリサイズ（マージン20px）
const margin = 20;
const maxContent = canvasSize - margin * 2;

let finalBuffer = trimmed.data;
let finalWidth = width;
let finalHeight = height;

if (width > maxContent || height > maxContent) {
  const resized = await sharp(trimmed.data)
    .resize(maxContent, maxContent, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });
  finalBuffer = resized.data;
  finalWidth = resized.info.width;
  finalHeight = resized.info.height;
  console.log(`      Resized to fit: ${finalWidth}x${finalHeight}`);
}

const left = Math.round((canvasSize - finalWidth) / 2);
const top = Math.round((canvasSize - finalHeight) / 2);

await sharp({
  create: {
    width: canvasSize,
    height: canvasSize,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: finalBuffer, left, top }])
  .png()
  .toFile(output);

const sizeKB = (fs.statSync(output).size / 1024).toFixed(1);
console.log(`\nDone: ${output} (${canvasSize}x${canvasSize}, ${sizeKB} KB)`);
