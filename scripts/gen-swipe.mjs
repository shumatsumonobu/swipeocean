/**
 * スワイプ用画像の生成スクリプト
 *
 * Usage:
 *   # 新規生成（プロンプト指定 → prompts.json に自動記録）
 *   node scripts/gen-swipe.mjs openness_high_01 --prompt "abstract art canvas..."
 *   node scripts/gen-swipe.mjs openness_high_01 --prompt "..." --temp 0.8 --top-p 0.9
 *
 *   # 再生成（JSON から読み込み）
 *   node scripts/gen-swipe.mjs openness_high_01
 *
 * プロンプトは scripts/prompts/swipe-image/prompts.json で管理。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import sharp from "sharp";
import { loadCredentialsPath } from "./utils/load-credentials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 設定 ──────────────────────────────────────────────
const CREDENTIALS_PATH = loadCredentialsPath();
const PROMPTS_DIR = path.join(__dirname, "prompts", "swipe-image");
const DEFAULT_OUTPUT_BASE = path.join(__dirname, "swipe");
const PROJECT_ROOT = path.join(__dirname, "..");
const PROJECT_ID = "1056519640312";
const LOCATION = "global";

const DEFAULT_CONFIG = {
  model: "gemini-3-pro-image-preview",
  aspectRatio: "1:1",
  imageSize: "1K",
  outputMimeType: "image/jpeg",
  temperature: 1,
  topP: 0.95,
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// ── ユーティリティ ────────────────────────────────────────
const PROMPTS_PATH = path.join(PROMPTS_DIR, "prompts.json");

function loadPrompts() {
  if (!fs.existsSync(PROMPTS_PATH)) {
    console.error(`[error] Prompt file not found: ${PROMPTS_PATH}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf8"));
}

function savePrompts(data) {
  fs.writeFileSync(PROMPTS_PATH, JSON.stringify(data, null, 2) + "\n");
}

function buildTrial(img, outputFile, resizedTo) {
  const trial = {
    at: new Date().toISOString(),
    prompt: img.prompt,
    output: path.relative(PROJECT_ROOT, outputFile),
  };
  if (img.temperature != null) trial.temperature = img.temperature;
  if (img.topP != null) trial.topP = img.topP;
  if (resizedTo) trial.resizedTo = resizedTo;
  return trial;
}

async function resizeImage(buffer, size) {
  return sharp(buffer)
    .resize(size, size, { fit: "cover" })
    .jpeg({ quality: 85 })
    .toBuffer();
}

async function generateImage(ai, fullPrompt, genConfig) {
  const cfg = { ...DEFAULT_CONFIG, ...genConfig };
  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: cfg.model,
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          temperature: cfg.temperature,
          topP: cfg.topP,
          candidateCount: 1,
          safetySettings: SAFETY_SETTINGS,
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: cfg.aspectRatio,
            imageSize: cfg.imageSize || "1K",
            outputMimeType: cfg.outputMimeType,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
      return null;
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED");
      if (is429 && attempt < MAX_RETRIES) {
        const wait = Math.pow(2, attempt) * 10;
        console.log(`\n[retry] Rate limited. Waiting ${wait}s... (attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, wait * 1000));
      } else {
        throw err;
      }
    }
  }
  return null;
}

// ── CLI ───────────────────────────────────────────────
const program = new Command();
program
  .name("gen-swipe")
  .description("スワイプ用画像を Vertex AI で生成")
  .argument("<key>", "生成するキー（例: openness_high_01）")
  .option("--prompt <text>", "画像生成プロンプト（指定時は JSON に自動記録）")
  .option("--temp <n>", "temperature (0.0〜1.0)")
  .option("--top-p <n>", "topP (0.0〜1.0)")
  .option("--out <dir>", "出力先ディレクトリ")
  .option("--force", "既存ファイルを上書き", false)
  .option("--size <px>", "リサイズ先のピクセル数（デフォルト: 512）", "512")
  .option("--no-resize", "リサイズせず元サイズで出力")
  .parse();

const keyName = program.args[0];
const opts = program.opts();

// ── メイン ─────────────────────────────────────────────
async function main() {
  if (!keyName) {
    console.error("[error] Key required. Usage: gen-swipe.mjs <key> [options]");
    process.exit(1);
  }

  const config = loadPrompts();
  const resizeSize = opts.resize !== false ? parseInt(opts.size, 10) : null;

  // キーの存在チェック
  if (!config.images[keyName]) {
    console.error(`[error] Unknown key: ${keyName}`);
    console.error(`Example: openness_high_01, conscientiousness_low_03`);
    process.exit(1);
  }

  const img = config.images[keyName];
  const commonPrefix = config.commonPrefix || "";

  // --prompt あり → プロンプトを上書きして JSON に記録
  if (opts.prompt) {
    img.prompt = opts.prompt;
    if (opts.temp) img.temperature = parseFloat(opts.temp);
    if (opts.topP) img.topP = parseFloat(opts.topP);
  }

  if (!img.trials) img.trials = [];

  // 生成設定
  const genConfig = {
    ...DEFAULT_CONFIG,
    ...config.config,
    ...(img.temperature != null && { temperature: img.temperature }),
    ...(img.topP != null && { topP: img.topP }),
  };

  const outputDir = opts.out ? path.resolve(opts.out) : DEFAULT_OUTPUT_BASE;

  // 連番で自動命名（前の画像を残す）
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  let outputPath;
  if (opts.out) {
    outputPath = path.join(outputDir, img.filename);
  } else {
    const baseName = path.basename(img.filename, ".jpg");
    const existing = fs.readdirSync(outputDir).filter((f) => f.startsWith(baseName + "-") && f.endsWith(".jpg"));
    const num = String(existing.length + 1).padStart(2, "0");
    outputPath = path.join(outputDir, `${baseName}-${num}.jpg`);
  }

  // スキップチェック
  if (fs.existsSync(outputPath) && !opts.force) {
    console.error(`[error] File exists: ${outputPath}. Use --force to overwrite.`);
    process.exit(1);
  }

  console.log(`\n=== Gen Swipe ===\n`);
  console.log(`  key:         ${keyName}`);
  console.log(`  model:       ${genConfig.model}`);
  console.log(`  temperature: ${genConfig.temperature}`);
  console.log(`  topP:        ${genConfig.topP}`);
  console.log(`  prompt:      ${img.prompt.substring(0, 80)}...`);
  console.log(`  resize:      ${resizeSize ? `${resizeSize}x${resizeSize}` : "off"}`);
  console.log(`  output:      ${outputPath}`);
  console.log();

  // 認証情報チェック
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`[error] Credentials not found: ${CREDENTIALS_PATH}`);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const ai = new GoogleGenAI({
    vertexai: true,
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: { credentials },
  });

  const fullPrompt = `${commonPrefix} ${img.prompt}`;
  const startTime = performance.now();
  let buffer = await generateImage(ai, fullPrompt, genConfig);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  if (!buffer) {
    console.error(`[error] No image returned from API (${elapsed}s)`);
    process.exit(1);
  }

  const origSize = buffer.length;
  if (resizeSize) {
    buffer = await resizeImage(buffer, resizeSize);
  }
  fs.writeFileSync(outputPath, buffer);

  const sizeInfo = resizeSize
    ? `${(origSize / 1024).toFixed(0)}KB → ${(buffer.length / 1024).toFixed(0)}KB`
    : `${(buffer.length / 1024).toFixed(0)}KB`;
  console.log(`Done: ${img.filename} (${elapsed}s, ${sizeInfo})`);

  // 試行ログを per-image trials に記録
  img.trials.push(buildTrial(img, outputPath, resizeSize));
  savePrompts(config);
  console.log(`[saved] prompts.json updated: ${keyName} (${img.trials.length} trials)`);
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
