/**
 * トップOGPバナー生成スクリプト（sharp合成）
 *
 * 既存キャラ画像8体 + ロゴテキスト + キャッチコピーを合成し、
 * トップページ用OGP画像（1200×630 PNG）を出力。
 *
 * Usage:
 *   # 試行生成（scripts/ogp/top/top-NN.png に連番出力）
 *   node scripts/gen-top-ogp.mjs
 *
 *   # ヒーロー背景なし
 *   node scripts/gen-top-ogp.mjs --no-bg
 *
 *   # 出力先を指定
 *   node scripts/gen-top-ogp.mjs --out scripts/ogp/top/test-01.png
 *
 *   # 確定版を本番配置
 *   node scripts/gen-top-ogp.mjs --out public/images/ogp/top.png --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 設定 ──────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, "..");
const FONT_PATH = path.join(__dirname, "fonts", "ZenMaruGothic-Bold.ttf");
const CHARACTERS_DIR = path.join(PROJECT_ROOT, "public", "images", "characters");
const HERO_BG_PATH = path.join(PROJECT_ROOT, "public", "images", "bg", "hero-top.png");
const PROMPTS_DIR = path.join(__dirname, "prompts", "top-ogp");
const TRIAL_DIR = path.join(__dirname, "ogp", "top");

// キャラ並び順（トップページと同じ）
const CHARACTER_ORDER = [
  "explorer", "planner", "socialite", "harmonizer",
  "empath", "adventurer", "craftsman", "balancer",
];

const DEFAULT_CONFIG = {
  width: 1200,
  height: 630,
  bgColor: "#0a0a1f",
  charSize: 150,
  charStride: 132,
  charY: 380,
  heroOpacity: 0.2,
};

// ── ユーティリティ ────────────────────────────────────────
function hexToRgba(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16), alpha: 1 };
}

const PROMPTS_PATH = path.join(PROMPTS_DIR, "prompts.json");

function loadPrompts() {
  if (!fs.existsSync(PROMPTS_PATH)) return null;
  return JSON.parse(fs.readFileSync(PROMPTS_PATH, "utf8"));
}

function savePrompts(data) {
  if (!fs.existsSync(PROMPTS_DIR)) {
    fs.mkdirSync(PROMPTS_DIR, { recursive: true });
  }
  fs.writeFileSync(PROMPTS_PATH, JSON.stringify(data, null, 2) + "\n");
}

function buildTrial(outputFile, heroBg, config) {
  return {
    at: new Date().toISOString(),
    output: path.relative(PROJECT_ROOT, outputFile),
    heroBg,
    width: config.width,
    height: config.height,
    bgColor: config.bgColor,
    charSize: config.charSize,
    charStride: config.charStride,
    charY: config.charY,
    heroOpacity: config.heroOpacity,
  };
}

// ── OCEAN letter colors (same as SwipeOceanLogo.tsx) ──
const OCEAN_COLORS = {
  O: "#a855f7",
  C: "#22c55e",
  E: "#f97316",
  A: "#ec4899",
  N: "#3b82f6",
};

// ── テキストSVG ──────────────────────────────────────
function buildTextSvg(fontBase64, config, lang = "ja") {
  const w = config.width;
  // "Swipe " in white, then "Ocean" with each letter colored
  const oceanLetters = "Ocean".split("").map((letter) => {
    const key = letter.toUpperCase();
    const color = OCEAN_COLORS[key] || "#f1f5f9";
    return `<tspan fill="${color}">${letter}</tspan>`;
  }).join("");

  const tagline = lang === "en" ? "What color are you today?" : "今日のキミ、どんな色？";

  return `<svg width="${w}" height="350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'ZenMaruGothic';
        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
        font-weight: bold;
      }
    </style>
  </defs>
  <text x="${w / 2}" y="140" text-anchor="middle"
        font-family="ZenMaruGothic, sans-serif" font-size="80" font-weight="900">
    <tspan fill="#f1f5f9">Swipe </tspan>${oceanLetters}
  </text>
  <text x="${w / 2}" y="200" text-anchor="middle"
        font-family="ZenMaruGothic, sans-serif" font-size="30" font-weight="bold"
        fill="#f1f5f9">${tagline}</text>
</svg>`;
}

// ── CLI ───────────────────────────────────────────────
const program = new Command();
program
  .name("gen-top-ogp")
  .description("トップページ用OGPバナーを生成（キャラ8体集合 + ロゴ）")
  .option("--out <filepath>", "出力ファイルパス（省略で scripts/ogp/top/top-NN.png に連番出力）")
  .option("--no-bg", "ヒーロー背景を重ねない")
  .option("--force", "既存ファイルを上書き", false)
  .option("--lang <code>", "言語コード（ja | en）", "ja")
  .parse();

const opts = program.opts();

// ── メイン ─────────────────────────────────────────────
async function main() {
  // JSON 読み込み or 初期化
  let promptData = loadPrompts() || {
    description: "Top page OGP banner (character ensemble + logo)",
    createdAt: new Date().toISOString().split("T")[0],
    trials: [],
  };

  const config = { ...DEFAULT_CONFIG };

  // 出力先の決定
  let outputPath;
  if (opts.out) {
    outputPath = path.resolve(opts.out);
  } else {
    // 連番で自動命名（scripts/ogp/top/top-NN.png）
    if (!fs.existsSync(TRIAL_DIR)) {
      fs.mkdirSync(TRIAL_DIR, { recursive: true });
    }
    const existing = fs.readdirSync(TRIAL_DIR).filter((f) => f.startsWith("top-") && f.endsWith(".png"));
    const num = String(existing.length + 1).padStart(2, "0");
    outputPath = path.join(TRIAL_DIR, `top-${num}.png`);
  }

  // 上書きチェック
  if (fs.existsSync(outputPath) && !opts.force) {
    console.error(`[error] File exists: ${outputPath}. Use --force to overwrite.`);
    process.exit(1);
  }

  // フォント読み込み
  if (!fs.existsSync(FONT_PATH)) {
    console.error(`[error] Font not found: ${FONT_PATH}`);
    process.exit(1);
  }
  const fontBase64 = fs.readFileSync(FONT_PATH).toString("base64");

  const heroBg = opts.bg !== false;
  const startTime = performance.now();

  console.log(`\n=== Gen Top OGP Banner (lang=${opts.lang}) ===\n`);
  console.log(`  output:  ${outputPath}`);
  console.log(`  lang:    ${opts.lang}`);
  console.log(`  hero bg: ${heroBg ? "yes" : "no"}`);
  console.log(`  config:  ${config.width}x${config.height}, char ${config.charSize}px, stride ${config.charStride}px`);
  console.log();

  // キャラ配置計算
  const charTotalWidth = config.charStride * (CHARACTER_ORDER.length - 1) + config.charSize;
  const charXOffset = Math.round((config.width - charTotalWidth) / 2);

  // 1. クリーム背景を生成
  const composites = [];

  // 2. ヒーロー背景（任意）
  if (heroBg && !fs.existsSync(HERO_BG_PATH)) {
    console.log(`[warn] Hero background not found: ${HERO_BG_PATH} (skipping)`);
  }
  if (heroBg && fs.existsSync(HERO_BG_PATH)) {
    const heroAlpha = Math.round(255 * config.heroOpacity);
    const heroBuf = await sharp(HERO_BG_PATH)
      .resize(config.width, config.height, { fit: "cover", position: "centre" })
      .ensureAlpha()
      .composite([{
        input: Buffer.from([255, 255, 255, heroAlpha]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: "dest-in",
      }])
      .png()
      .toBuffer();

    composites.push({ input: heroBuf, top: 0, left: 0 });
    console.log(`  hero bg loaded: ${HERO_BG_PATH}`);
  }

  // 3. キャラ8体を配置
  for (let i = 0; i < CHARACTER_ORDER.length; i++) {
    const type = CHARACTER_ORDER[i];
    const charPath = path.join(CHARACTERS_DIR, `type_${type}.png`);

    if (!fs.existsSync(charPath)) {
      console.error(`[error] Character image not found: ${charPath}`);
      process.exit(1);
    }

    const charBuf = await sharp(charPath)
      .resize(config.charSize, config.charSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const x = charXOffset + i * config.charStride;
    composites.push({ input: charBuf, top: config.charY, left: x });
    console.log(`  ${type}: x=${x}, y=${config.charY}`);
  }

  // 4. テキストSVG
  const textSvg = buildTextSvg(fontBase64, config, opts.lang);
  composites.push({ input: Buffer.from(textSvg), top: 30, left: 0 });

  // 5. 合成 & 出力
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await sharp({
    create: {
      width: config.width,
      height: config.height,
      channels: 4,
      background: hexToRgba(config.bgColor),
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  const sizeKB = (stat.size / 1024).toFixed(1);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone: ${outputPath} (${sizeKB} KB, ${elapsed}s)`);

  // 6. 試行ログを JSON に記録
  promptData.trials.push(buildTrial(outputPath, heroBg, config));
  savePrompts(promptData);
  console.log(`[saved] prompts.json updated (${promptData.trials.length} trials)`);
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
