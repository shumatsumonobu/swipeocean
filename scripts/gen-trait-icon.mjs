/**
 * 特性アイコン画像の生成スクリプト（試行 + 本番 統合）
 *
 * Usage:
 *   # 新規生成（プロンプト指定 → prompts.json に自動記録）
 *   node scripts/gen-trait-icon.mjs openness --prompt "elegant icon..." --temp 0.3
 *   node scripts/gen-trait-icon.mjs openness --prompt "..." --reference reference.png --out test-01.png
 *
 *   # 再生成（JSON から読み込み）
 *   node scripts/gen-trait-icon.mjs openness
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { loadCredentialsPath } from "./utils/load-credentials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 設定 ──────────────────────────────────────────────
const CREDENTIALS_PATH = loadCredentialsPath();
const PROMPTS_DIR = path.join(__dirname, "prompts", "trait-icon");
const ICONS_DIR = path.join(__dirname, "trait-icons");
const PROJECT_ID = "1056519640312";
const LOCATION = "global";

const DEFAULT_CONFIG = {
  model: "gemini-3-pro-image-preview",
  aspectRatio: "1:1",
  outputMimeType: "image/png",
  temperature: 0.3,
  topP: 0.85,
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
  if (!fs.existsSync(PROMPTS_PATH)) return null;
  return JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf8"));
}

function buildTrial(entry, outputFile) {
  const trial = { at: new Date().toISOString(), prompt: entry.prompt, output: path.relative(ICONS_DIR, outputFile) };
  if (entry.temperature != null) trial.temperature = entry.temperature;
  if (entry.topP != null) trial.topP = entry.topP;
  if (entry.reference) trial.reference = entry.reference;
  return trial;
}

function savePrompts(data) {
  if (!fs.existsSync(PROMPTS_DIR)) {
    fs.mkdirSync(PROMPTS_DIR, { recursive: true });
  }
  fs.writeFileSync(PROMPTS_PATH, JSON.stringify(data, null, 2) + "\n");
}

// ── 画像生成 ──────────────────────────────────────────
async function generateImage(ai, prompt, referencePath, genConfig) {
  const inputParts = [];

  // 参考画像
  if (referencePath) {
    const absReference = path.resolve(referencePath);
    if (!fs.existsSync(absReference)) {
      console.error(`[error] Reference image not found: ${absReference}`);
      process.exit(1);
    }
    const referenceData = fs.readFileSync(absReference);
    const ext = path.extname(absReference).toLowerCase();
    const mimeMap = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
    inputParts.push({ inlineData: { data: referenceData.toString("base64"), mimeType: mimeMap[ext] || "image/jpeg" } });
  }

  inputParts.push({ text: prompt });

  // 429 リトライ
  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: genConfig.model,
        contents: [{ role: "user", parts: inputParts }],
        config: {
          temperature: genConfig.temperature,
          topP: genConfig.topP,
          candidateCount: 1,
          safetySettings: SAFETY_SETTINGS,
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: genConfig.aspectRatio,
            imageSize: "1K",
            outputMimeType: genConfig.outputMimeType,
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
        console.log(`[retry] Rate limited. Waiting ${wait}s... (attempt ${attempt}/${MAX_RETRIES})`);
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
  .name("gen-trait-icon")
  .description("特性アイコン画像を生成（試行 + 本番 統合）")
  .argument("[trait]", "特性名（openness, conscientiousness, ...）")
  .option("--prompt <text>", "画像生成プロンプト（指定時は JSON に自動記録）")
  .option("--temp <n>", "temperature (0.0〜1.0)")
  .option("--top-p <n>", "topP (0.0〜1.0)")
  .option("--reference <file>", "参考画像ファイルパス")
  .option("--out <filename>", "出力ファイル名（デフォルト: trait-icons/{trait}-{NN}.png）")
  .option("--force", "既存ファイルを上書き", false)
  .parse();

const traitName = program.args[0];
const opts = program.opts();

// ── メイン ─────────────────────────────────────────────
async function main() {
  if (!traitName) {
    console.error("[error] Trait name required. Usage: gen-trait-icon.mjs <trait> [options]");
    process.exit(1);
  }

  // プロンプトJSON読み込み（存在すれば）
  let promptData = loadPrompts() || {
    description: "Trait icons",
    createdAt: new Date().toISOString().split("T")[0],
    config: { ...DEFAULT_CONFIG },
    icons: {},
  };

  const existingIcon = promptData.icons[traitName];

  // --prompt がある → 新規生成モード
  if (opts.prompt) {
    const iconEntry = existingIcon || { filename: `trait_${traitName}.png`, trials: [] };
    iconEntry.prompt = opts.prompt;
    if (opts.temp) iconEntry.temperature = parseFloat(opts.temp);
    if (opts.topP) iconEntry.topP = parseFloat(opts.topP);
    if (opts.reference) iconEntry.reference = opts.reference;
    if (!iconEntry.trials) iconEntry.trials = [];

    const genConfig = {
      ...DEFAULT_CONFIG,
      ...promptData.config,
      ...(iconEntry.temperature != null && { temperature: iconEntry.temperature }),
      ...(iconEntry.topP != null && { topP: iconEntry.topP }),
    };

    const outputFile = await generate(traitName, iconEntry.prompt, iconEntry.reference, genConfig);

    // 試行ログを自動記録
    if (outputFile) {
      iconEntry.trials.push(buildTrial(iconEntry, outputFile));
    }

    promptData.icons[traitName] = iconEntry;
    savePrompts(promptData);
    console.log(`[saved] prompts.json updated: ${traitName} (${iconEntry.trials.length} trials)`);
    return;
  }

  // --prompt なし → JSONから再生成モード
  if (!existingIcon) {
    console.error(`[error] No saved prompt for "${traitName}" in prompts.json.`);
    console.error(`        Use --prompt to create one.`);
    process.exit(1);
  }

  if (!existingIcon.trials) existingIcon.trials = [];

  const genConfig = {
    ...DEFAULT_CONFIG,
    ...promptData.config,
    ...(existingIcon.temperature != null && { temperature: existingIcon.temperature }),
    ...(existingIcon.topP != null && { topP: existingIcon.topP }),
  };

  const outputFile = await generate(traitName, existingIcon.prompt, existingIcon.reference, genConfig);

  // 再生成も試行ログに記録
  if (outputFile) {
    existingIcon.trials.push(buildTrial(existingIcon, outputFile));
    savePrompts(promptData);
    console.log(`[saved] prompts.json updated: ${traitName} (${existingIcon.trials.length} trials)`);
  }
}

async function generate(trait, prompt, referencePath, genConfig) {
  // 出力先
  let outputPath;

  if (opts.out) {
    outputPath = path.join(ICONS_DIR, opts.out);
  } else {
    // 連番で自動命名
    if (!fs.existsSync(ICONS_DIR)) {
      fs.mkdirSync(ICONS_DIR, { recursive: true });
    }
    const existing = fs.readdirSync(ICONS_DIR).filter((f) => f.startsWith(trait + "-") && f.endsWith(".png"));
    const num = String(existing.length + 1).padStart(2, "0");
    outputPath = path.join(ICONS_DIR, `${trait}-${num}.png`);
  }

  if (fs.existsSync(outputPath) && !opts.force) {
    console.error(`[error] File exists: ${outputPath}. Use --force to overwrite.`);
    return null;
  }

  console.log(`\n=== Gen Trait Icon: ${trait} ===\n`);
  console.log(`  model:       ${genConfig.model}`);
  console.log(`  temperature: ${genConfig.temperature}`);
  console.log(`  topP:        ${genConfig.topP}`);
  console.log(`  prompt:      ${prompt.substring(0, 80)}...`);
  if (referencePath) console.log(`  reference:   ${referencePath}`);
  console.log(`  output:      ${outputPath}`);
  console.log();

  // 認証
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

  const startTime = performance.now();
  const buffer = await generateImage(ai, prompt, referencePath, genConfig);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  if (!buffer) {
    console.error("[error] No image returned from API");
    process.exit(1);
  }

  // 出力ディレクトリ確保
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`Done: ${outputPath} (${sizeKB} KB, ${elapsed}s)`);
  return outputPath;
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
