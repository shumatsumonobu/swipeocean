/**
 * 確定済み画像アセットを本番ディレクトリに配置するスクリプト
 *
 * 試行ディレクトリ（scripts/）から本番ディレクトリ（public/, src/app/）へ
 * リネーム・リサイズしてコピーする。新バージョン作成時にも再利用可能。
 *
 * Usage:
 *   node scripts/deploy-assets.mjs              # 全カテゴリ一括配置
 *   node scripts/deploy-assets.mjs characters   # キャラクターのみ
 *   node scripts/deploy-assets.mjs traits       # 特性アイコンのみ
 *   node scripts/deploy-assets.mjs hints        # スワイプヒントのみ
 *   node scripts/deploy-assets.mjs app-icon     # アプリアイコンのみ
 *   node scripts/deploy-assets.mjs ogp          # OGP画像のみ（--compose実行）
 *   node scripts/deploy-assets.mjs --dry-run    # 実行せず確認のみ
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ── 確定ファイルマッピング ──────────────────────────────────
// 新バージョン作成時はここを更新する

const CHARACTERS = {
  explorer:   "explorer-05-normalized.png",
  planner:    "planner-05-normalized.png",
  socialite:  "socialite-05-normalized.png",
  harmonizer: "harmonizer-02-normalized.png",
  empath:     "empath-07-normalized.png",
  adventurer: "adventurer-23-normalized.png",
  craftsman:  "craftsman-05-normalized.png",
  balancer:   "balancer-03-normalized.png",
};

const TRAIT_ICONS = {
  openness:          "openness-21.png",
  conscientiousness: "conscientiousness-05.png",
  extraversion:      "extraversion-47.png",
  agreeableness:     "agreeableness-02.png",
  neuroticism:       "neuroticism-02.png",
};

const SWIPE_HINTS = {
  "swipe-left":  "swipe-left-03-transparent.png",
  "swipe-right": "swipe-right-04-transparent.png",
};

const CHARACTERS_BG = {
  explorer:   "explorer-bg-04.png",
  planner:    "planner-bg-02.png",
  socialite:  "socialite-bg-01.png",
  harmonizer: "harmonizer-bg-01.png",
  empath:     "empath-bg-01.png",
  adventurer: "adventurer-bg-29.png",
  craftsman:  "craftsman-bg-01.png",
  balancer:   "balancer-bg-27.png",
};

const APP_ICON = "app-icon-01.png";

const BG_ASSETS = {
  hero:    { file: "bg-hero-15.png", width: 1200, height: 675, dest: "hero-top.png" },
};

// ── ユーティリティ ──────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest, dryRun) {
  if (!fs.existsSync(src)) {
    console.error(`  [error] Source not found: ${src}`);
    process.exit(1);
  }
  if (dryRun) {
    console.log(`  [dry-run] ${path.relative(PROJECT_ROOT, src)} → ${path.relative(PROJECT_ROOT, dest)}`);
    return;
  }
  fs.copyFileSync(src, dest);
  const sizeKB = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`  ${path.relative(PROJECT_ROOT, dest)} (${sizeKB} KB)`);
}

// ── 配置関数 ────────────────────────────────────────────

async function deployCharacters(dryRun) {
  console.log("\n=== Characters (8) ===\n");
  const srcDir = path.join(__dirname, "characters");
  const destDir = path.join(PROJECT_ROOT, "public", "images", "characters");
  ensureDir(destDir);

  for (const [type, file] of Object.entries(CHARACTERS)) {
    copyFile(
      path.join(srcDir, file),
      path.join(destDir, `type_${type}.png`),
      dryRun,
    );
  }

  console.log("\n=== Character Backgrounds (8) ===\n");
  for (const [type, file] of Object.entries(CHARACTERS_BG)) {
    copyFile(
      path.join(srcDir, file),
      path.join(destDir, `type_${type}_bg.png`),
      dryRun,
    );
  }
}

async function deployTraitIcons(dryRun) {
  console.log("\n=== Trait Icons (5) ===\n");
  const srcDir = path.join(__dirname, "trait-icons");
  const destDir = path.join(PROJECT_ROOT, "public", "images", "traits");
  ensureDir(destDir);

  for (const [trait, file] of Object.entries(TRAIT_ICONS)) {
    copyFile(
      path.join(srcDir, file),
      path.join(destDir, `trait_${trait}.png`),
      dryRun,
    );
  }
}

async function deploySwipeHints(dryRun) {
  console.log("\n=== Swipe Hints (2) ===\n");
  const srcDir = path.join(__dirname, "swipe-hints");
  const destDir = path.join(PROJECT_ROOT, "public", "images", "swipe-hints");
  ensureDir(destDir);

  for (const [name, file] of Object.entries(SWIPE_HINTS)) {
    copyFile(
      path.join(srcDir, file),
      path.join(destDir, `${name}.png`),
      dryRun,
    );
  }
}

async function deployAppIcon(dryRun) {
  console.log("\n=== App Icon (3 sizes) ===\n");
  const src = path.join(__dirname, "app-icons", APP_ICON);
  if (!fs.existsSync(src)) {
    console.error(`  [error] Source not found: ${src}`);
    process.exit(1);
  }

  const destDir = path.join(PROJECT_ROOT, "src", "app");
  const sizes = [
    { name: "icon.png",       size: 192 },
    { name: "apple-icon.png", size: 180 },
    { name: "favicon.ico",    size: 32 },
  ];

  for (const { name, size } of sizes) {
    const dest = path.join(destDir, name);
    if (dryRun) {
      console.log(`  [dry-run] ${path.relative(PROJECT_ROOT, src)} → ${path.relative(PROJECT_ROOT, dest)} (${size}×${size})`);
    } else {
      await sharp(src).resize(size, size).png().toFile(dest);
      const sizeKB = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`  ${path.relative(PROJECT_ROOT, dest)} (${size}×${size}, ${sizeKB} KB)`);
    }
  }
}

async function deployOgp(dryRun) {
  console.log("\n=== OGP (compose) ===\n");
  if (dryRun) {
    console.log("  [dry-run] Would run: gen-ogp.mjs --compose");
    return;
  }
  // gen-ogp.mjs --compose を動的インポートせず、子プロセスで実行
  const { execSync } = await import("node:child_process");
  execSync("node scripts/gen-ogp.mjs --compose", {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
  });
}

async function deployBg(dryRun) {
  console.log("\n=== Background Images ===\n");
  const destDir = path.join(PROJECT_ROOT, "public", "images", "bg");
  ensureDir(destDir);

  for (const [key, asset] of Object.entries(BG_ASSETS)) {
    if (!asset.file) {
      console.log(`  [skip] ${key}: file not set yet (update BG_ASSETS after confirmation)`);
      continue;
    }
    const srcDir = path.join(__dirname, "bg-hero");
    const src = path.join(srcDir, asset.file);

    if (!fs.existsSync(src)) {
      console.error(`  [error] Source not found: ${src}`);
      process.exit(1);
    }

    const dest = path.join(destDir, asset.dest);
    if (dryRun) {
      console.log(`  [dry-run] ${path.relative(PROJECT_ROOT, src)} → ${path.relative(PROJECT_ROOT, dest)} (${asset.width}×${asset.height})`);
    } else {
      await sharp(src).resize(asset.width, asset.height).png().toFile(dest);
      const sizeKB = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`  ${path.relative(PROJECT_ROOT, dest)} (${asset.width}×${asset.height}, ${sizeKB} KB)`);
    }
  }
}

// ── CLI ───────────────────────────────────────────────
const CATEGORIES = {
  characters: deployCharacters,
  traits:     deployTraitIcons,
  hints:      deploySwipeHints,
  "app-icon": deployAppIcon,
  ogp:        deployOgp,
  bg:         deployBg,
};

const program = new Command();
program
  .name("deploy-assets")
  .description("確定済み画像アセットを本番ディレクトリに配置")
  .argument("[category]", `カテゴリ（${Object.keys(CATEGORIES).join(", ")}）。省略で全カテゴリ`)
  .option("--dry-run", "実行せず確認のみ", false)
  .parse();

const category = program.args[0];
const dryRun = program.opts().dryRun;

async function main() {
  if (dryRun) {
    console.log("[dry-run mode]");
  }

  if (category) {
    const fn = CATEGORIES[category];
    if (!fn) {
      console.error(`[error] Unknown category: ${category}`);
      console.error(`        Available: ${Object.keys(CATEGORIES).join(", ")}`);
      process.exit(1);
    }
    await fn(dryRun);
  } else {
    for (const fn of Object.values(CATEGORIES)) {
      await fn(dryRun);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
