/**
 * OGP画像の横長背景シーン生成スクリプト（試行 + 本番 + テキスト帯合成 統合）
 *
 * 確定済みの正方形背景シーンを --reference で渡し、同じ構図・キャラ・色味で横長版を生成。
 * --compose で確定済み横長シーンにテキスト帯を合成し、最終OGP画像を出力。
 *
 * Usage:
 *   # 新規生成（プロンプト指定 → prompts.json に自動記録）
 *   node scripts/gen-ogp.mjs explorer --prompt "..." --reference scripts/characters/explorer-bg-04.png
 *   node scripts/gen-ogp.mjs explorer --prompt "..." --reference reference.png --out test-01.png
 *
 *   # 再生成（JSON から読み込み）
 *   node scripts/gen-ogp.mjs explorer
 *
 *   # テキスト帯合成（全8タイプ or 指定タイプ）
 *   node scripts/gen-ogp.mjs --compose
 *   node scripts/gen-ogp.mjs --compose explorer
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
const PROMPTS_DIR = path.join(__dirname, "prompts", "ogp");
const OGP_DIR = path.join(__dirname, "ogp");
const PROJECT_ID = "1056519640312";
const LOCATION = "global";

const DEFAULT_CONFIG = {
  model: "gemini-3-pro-image-preview",
  aspectRatio: "16:9",
  outputMimeType: "image/png",
  temperature: 0.5,
  topP: 0.9,
};

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_OGP_DIR = path.join(PROJECT_ROOT, "public", "images", "ogp");
const FONT_PATH = path.join(__dirname, "fonts", "ZenMaruGothic-Bold.ttf");

const CONFIRMED_SCENES = {
  explorer:   { file: "explorer-01.png",   color: "#2DD4BF", nameJa: "探求者",       nameEn: "Explorer" },
  planner:    { file: "planner-01.png",    color: "#22C55E", nameJa: "計画者",       nameEn: "Planner" },
  socialite:  { file: "socialite-01.png",  color: "#F97316", nameJa: "社交家",       nameEn: "Socialite" },
  harmonizer: { file: "harmonizer-02.png", color: "#F9A8D4", nameJa: "協調者",       nameEn: "Harmonizer" },
  empath:     { file: "empath-01.png",     color: "#C084FC", nameJa: "感受者",       nameEn: "Empath" },
  adventurer: { file: "adventurer-01.png", color: "#F87171", nameJa: "冒険家",       nameEn: "Adventurer" },
  craftsman:  { file: "craftsman-01.png",  color: "#FACC15", nameJa: "職人",         nameEn: "Craftsman" },
  balancer:   { file: "balancer-01.png",   color: "#0EA5E9", nameJa: "バランサー",   nameEn: "Balancer" },
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
  const trial = { at: new Date().toISOString(), prompt: entry.prompt, output: path.relative(OGP_DIR, outputFile) };
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
  .name("gen-ogp")
  .description("OGP画像の横長背景シーンを生成（試行 + 本番 + テキスト帯合成）")
  .argument("[type]", "タイプ名（explorer, planner, socialite, harmonizer, empath, adventurer, craftsman, balancer）")
  .option("--prompt <text>", "画像生成プロンプト（指定時は JSON に自動記録）")
  .option("--temp <n>", "temperature (0.0〜2.0)")
  .option("--top-p <n>", "topP (0.0〜1.0)")
  .option("--reference <file>", "参考画像ファイルパス")
  .option("--out <filename>", "出力ファイル名（デフォルト: ogp/{type}-{NN}.png）")
  .option("--force", "既存ファイルを上書き", false)
  .option("--compose [type]", "テキスト帯合成モード（タイプ省略で全8タイプ一括）")
  .option("--lang <code>", "言語コード（ja | en）", "ja")
  .parse();

const typeName = program.args[0];
const opts = program.opts();

// ── テキスト帯合成 ──────────────────────────────────────
function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function buildBandSvg(scene, fontBase64, lang = "ja") {
  const { color, nameJa, nameEn } = scene;
  const { r, g, b } = hexToRgb(color);

  // 英語版: nameEnのみ表示
  // 日本語版: nameJaメイン、nameEnサブ
  const textContent = lang === "en"
    ? `<text x="40" y="68" font-family="ZenMaruGothic, sans-serif" font-size="48" font-weight="bold" fill="white">${nameEn}</text>`
    : `<text x="40" y="48" font-family="ZenMaruGothic, sans-serif" font-size="40" font-weight="bold" fill="white">${nameJa}</text>
  <text x="40" y="78" font-family="ZenMaruGothic, sans-serif" font-size="22" font-weight="bold" fill="white">${nameEn}</text>`;

  return `<svg width="1200" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'ZenMaruGothic';
        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
        font-weight: bold;
      }
    </style>
  </defs>
  <rect width="1200" height="120" fill="rgba(${r},${g},${b},0.5)"/>
  ${textContent}
  <text x="1160" y="68" font-family="ZenMaruGothic, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="end">Swipe Ocean</text>
</svg>`;
}

async function composeOgp(targetType, lang = "ja") {
  const types = targetType ? [targetType] : Object.keys(CONFIRMED_SCENES);

  // フォントをbase64化（1回だけ読み込み）
  if (!fs.existsSync(FONT_PATH)) {
    console.error(`[error] Font not found: ${FONT_PATH}`);
    process.exit(1);
  }
  const fontBase64 = fs.readFileSync(FONT_PATH).toString("base64");

  // 出力ディレクトリ確保
  if (!fs.existsSync(PUBLIC_OGP_DIR)) {
    fs.mkdirSync(PUBLIC_OGP_DIR, { recursive: true });
  }

  console.log(`\n=== Compose OGP (${types.length} types, lang=${lang}) ===\n`);

  for (const type of types) {
    const scene = CONFIRMED_SCENES[type];
    if (!scene) {
      console.error(`[error] Unknown type: ${type}`);
      process.exit(1);
    }

    const inputPath = path.join(OGP_DIR, scene.file);
    if (!fs.existsSync(inputPath)) {
      console.error(`[error] Source not found: ${inputPath}`);
      process.exit(1);
    }

    // 英語版は {type}-en.png、日本語版は {type}-ja.png
    const outputFilename = `${type}-${lang}.png`;
    const outputPath = path.join(PUBLIC_OGP_DIR, outputFilename);
    const bandSvg = buildBandSvg(scene, fontBase64, lang);

    await sharp(inputPath)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .composite([{ input: Buffer.from(bandSvg), top: 510, left: 0 }])
      .png()
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    const sizeKB = (stat.size / 1024).toFixed(1);
    console.log(`  ${type}: ${outputPath} (${sizeKB} KB)`);
  }

  console.log(`\nDone: ${types.length} OGP images composed (lang=${lang}).`);
}

// ── メイン ─────────────────────────────────────────────
async function main() {
  // --compose モード
  if (opts.compose != null) {
    const target = typeof opts.compose === "string" ? opts.compose : null;
    await composeOgp(target, opts.lang);
    return;
  }

  if (!typeName) {
    console.error("[error] Type name required. Usage: gen-ogp.mjs <type> [options]");
    process.exit(1);
  }

  // プロンプトJSON読み込み（存在すれば）
  let promptData = loadPrompts() || {
    description: "OGP wide background scenes",
    createdAt: new Date().toISOString().split("T")[0],
    config: { ...DEFAULT_CONFIG },
    scenes: {},
  };

  const existingScene = promptData.scenes[typeName];

  // --prompt がある → 新規生成モード
  if (opts.prompt) {
    const sceneEntry = existingScene || { filename: `${typeName}.png`, trials: [] };
    sceneEntry.prompt = opts.prompt;
    if (opts.temp) sceneEntry.temperature = parseFloat(opts.temp);
    if (opts.topP) sceneEntry.topP = parseFloat(opts.topP);
    if (opts.reference) sceneEntry.reference = opts.reference;
    if (!sceneEntry.trials) sceneEntry.trials = [];

    const genConfig = {
      ...DEFAULT_CONFIG,
      ...promptData.config,
      ...(sceneEntry.temperature != null && { temperature: sceneEntry.temperature }),
      ...(sceneEntry.topP != null && { topP: sceneEntry.topP }),
    };

    const outputFile = await generate(typeName, sceneEntry.prompt, sceneEntry.reference, genConfig);

    // 試行ログを自動記録
    if (outputFile) {
      sceneEntry.trials.push(buildTrial(sceneEntry, outputFile));
    }

    promptData.scenes[typeName] = sceneEntry;
    savePrompts(promptData);
    console.log(`[saved] prompts.json updated: ${typeName} (${sceneEntry.trials.length} trials)`);
    return;
  }

  // --prompt なし → JSONから再生成モード
  if (!existingScene) {
    console.error(`[error] No saved prompt for "${typeName}" in prompts.json.`);
    console.error(`        Use --prompt to create one.`);
    process.exit(1);
  }

  if (!existingScene.trials) existingScene.trials = [];

  const genConfig = {
    ...DEFAULT_CONFIG,
    ...promptData.config,
    ...(existingScene.temperature != null && { temperature: existingScene.temperature }),
    ...(existingScene.topP != null && { topP: existingScene.topP }),
  };

  const outputFile = await generate(typeName, existingScene.prompt, existingScene.reference, genConfig);

  // 再生成も試行ログに記録
  if (outputFile) {
    existingScene.trials.push(buildTrial(existingScene, outputFile));
    savePrompts(promptData);
    console.log(`[saved] prompts.json updated: ${typeName} (${existingScene.trials.length} trials)`);
  }
}

async function generate(typeName, prompt, referencePath, genConfig) {
  // 出力先
  let outputPath;

  if (opts.out) {
    outputPath = path.join(OGP_DIR, opts.out);
  } else {
    // 連番で自動命名
    if (!fs.existsSync(OGP_DIR)) {
      fs.mkdirSync(OGP_DIR, { recursive: true });
    }
    const existing = fs.readdirSync(OGP_DIR).filter((f) => f.startsWith(typeName + "-") && f.endsWith(".png"));
    const num = String(existing.length + 1).padStart(2, "0");
    outputPath = path.join(OGP_DIR, `${typeName}-${num}.png`);
  }

  if (fs.existsSync(outputPath) && !opts.force) {
    console.error(`[error] File exists: ${outputPath}. Use --force to overwrite.`);
    return null;
  }

  console.log(`\n=== Gen OGP: ${typeName} ===\n`);
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
    console.error(`[error] No image returned for ${typeName}`);
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
