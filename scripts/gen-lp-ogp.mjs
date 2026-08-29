/**
 * LP OGP画像生成スクリプト（sharp合成）
 *
 * キャラ8体（上部横一列）+ キャッチコピー（下部）を合成し、
 * LP（/about）用OGP画像（1200×630 PNG）を出力。日英2枚体制。
 * トップOGPとは上下逆の構図で差別化。
 *
 * Usage:
 *   # 試行生成（scripts/ogp/about/about-{lang}-NN.png に連番出力）
 *   node scripts/gen-lp-ogp.mjs --lang ja
 *   node scripts/gen-lp-ogp.mjs --lang en
 *
 *   # config カスタマイズ
 *   node scripts/gen-lp-ogp.mjs --lang ja --char-size 140 --char-y 60
 *
 *   # ヒーロー背景なし
 *   node scripts/gen-lp-ogp.mjs --lang ja --no-bg
 *
 *   # 出力先を指定
 *   node scripts/gen-lp-ogp.mjs --lang ja --out scripts/ogp/about/test-01.png
 *
 *   # 確定版を本番配置
 *   node scripts/gen-lp-ogp.mjs --lang ja --out public/images/ogp/about-ja.png --force
 *   node scripts/gen-lp-ogp.mjs --lang en --out public/images/ogp/about-en.png --force
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
const PROMPTS_DIR = path.join(__dirname, "prompts", "lp-ogp");
const TRIAL_DIR = path.join(__dirname, "ogp", "about");

// キャラ並び順（トップページと同じ）
const CHARACTER_ORDER = [
  "explorer", "planner", "socialite", "harmonizer",
  "empath", "adventurer", "craftsman", "balancer",
];

// OCEAN letter colors (same as SwipeOceanLogo.tsx)
const OCEAN_COLORS = {
  O: "#a855f7",
  C: "#22c55e",
  E: "#f97316",
  A: "#ec4899",
  N: "#3b82f6",
};

// 日英テキスト
const TEXTS = {
  ja: {
    catchphrase: "今日のキミ、どんな色？",
    subtitle: "パーソナリティチェック",
  },
  en: {
    catchphrase: "What color are you today?",
    subtitle: "Personality Check",
  },
};

const DEFAULT_CONFIG = {
  width: 1200,
  height: 630,
  bgColor: "#0a0a1f",
  charSize: 120,
  charStride: 120,
  charY: 80,
  heroOpacity: 0.2,
  textSvgTop: 350,
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

// ── テキスト SVG（下部配置）──────────────────────────────
function buildTextSvg(fontBase64, lang, config) {
  const w = config.width;
  const texts = TEXTS[lang];

  // "Swipe Ocean" with colored Ocean letters
  const oceanLetters = "Ocean".split("").map((letter) => {
    const key = letter.toUpperCase();
    const color = OCEAN_COLORS[key] || "#f1f5f9";
    return `<tspan fill="${color}">${letter}</tspan>`;
  }).join("");

  return `<svg width="${w}" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'ZenMaruGothic';
        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
        font-weight: bold;
      }
    </style>
  </defs>
  <text x="${w / 2}" y="60" text-anchor="middle"
        font-family="ZenMaruGothic, sans-serif" font-size="44" font-weight="900"
        fill="#f1f5f9">${texts.catchphrase}</text>
  <text x="${w / 2}" y="110" text-anchor="middle"
        font-family="ZenMaruGothic, sans-serif" font-size="24" font-weight="bold">
    <tspan fill="#f1f5f9">Swipe </tspan>${oceanLetters}<tspan fill="#f1f5f9"> — ${texts.subtitle}</tspan>
  </text>
</svg>`;
}

// ── CLI ───────────────────────────────────────────────
const program = new Command();
program
  .name("gen-lp-ogp")
  .description("LP用OGP画像を生成（キャラ8体上部 + コピー下部、トップOGPと上下逆構図）")
  .option("--lang <lang>", "言語（ja / en）", "ja")
  .option("--out <filepath>", "出力ファイルパス（省略で scripts/ogp/about/about-{lang}-NN.png に連番出力）")
  .option("--no-bg", "ヒーロー背景を重ねない")
  .option("--char-size <n>", "キャラサイズ px")
  .option("--char-stride <n>", "キャラ間隔 px")
  .option("--char-y <n>", "キャラY位置 px")
  .option("--text-y <n>", "テキストSVG Y位置 px")
  .option("--force", "既存ファイルを上書き", false)
  .parse();

const opts = program.opts();

// ── メイン ─────────────────────────────────────────────
async function main() {
  const lang = opts.lang === "en" ? "en" : "ja";

  // JSON 読み込み or 初期化
  let promptData = loadPrompts() || {
    description: "LP OGP image (8 characters top + copy bottom, inverted layout vs top OGP)",
    createdAt: new Date().toISOString().split("T")[0],
    defaultConfig: { ...DEFAULT_CONFIG },
    trials: [],
  };

  // config: デフォルト → JSON の defaultConfig → CLI引数でオーバーライド
  const config = {
    ...DEFAULT_CONFIG,
    ...(promptData.defaultConfig || {}),
  };
  if (opts.charSize) config.charSize = parseInt(opts.charSize, 10);
  if (opts.charStride) config.charStride = parseInt(opts.charStride, 10);
  if (opts.charY) config.charY = parseInt(opts.charY, 10);
  if (opts.textY) config.textSvgTop = parseInt(opts.textY, 10);

  // 出力先の決定
  let outputPath;
  if (opts.out) {
    outputPath = path.resolve(opts.out);
  } else {
    if (!fs.existsSync(TRIAL_DIR)) {
      fs.mkdirSync(TRIAL_DIR, { recursive: true });
    }
    const prefix = `about-${lang}-`;
    const existing = fs.readdirSync(TRIAL_DIR).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
    const num = String(existing.length + 1).padStart(2, "0");
    outputPath = path.join(TRIAL_DIR, `${prefix}${num}.png`);
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

  console.log(`\n=== Gen LP OGP Image ===\n`);
  console.log(`  lang:       ${lang}`);
  console.log(`  output:     ${outputPath}`);
  console.log(`  hero bg:    ${heroBg ? "yes" : "no"}`);
  console.log(`  charSize:   ${config.charSize}px`);
  console.log(`  charStride: ${config.charStride}px`);
  console.log(`  charY:      ${config.charY}px`);
  console.log();

  const composites = [];

  // 1. ヒーロー背景（任意）
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
    console.log(`  hero bg loaded`);
  }

  // 2. キャラ8体を上部に横一列配置
  const charTotalWidth = config.charStride * (CHARACTER_ORDER.length - 1) + config.charSize;
  const charXOffset = Math.round((config.width - charTotalWidth) / 2);

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

  // 3. テキスト（下部：キャッチコピー + サービス説明）
  const textSvg = buildTextSvg(fontBase64, lang, config);
  composites.push({ input: Buffer.from(textSvg), top: config.textSvgTop, left: 0 });

  // 4. 合成 & 出力
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

  // 5. 試行ログを JSON に記録
  promptData.trials.push({
    at: new Date().toISOString(),
    output: path.relative(PROJECT_ROOT, outputPath),
    lang,
    heroBg,
    charSize: config.charSize,
    charStride: config.charStride,
    charY: config.charY,
  });
  savePrompts(promptData);
  console.log(`[saved] prompts.json updated (${promptData.trials.length} trials)`);
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
