/**
 * 透過PNG のアルファチャンネルを二値化し、ハロ（半透明にじみ）を除去する
 *
 * Usage:
 *   node scripts/clean-alpha.mjs scripts/trait-icons/agreeableness-04.png
 *   node scripts/clean-alpha.mjs scripts/trait-icons/agreeableness-04.png --threshold 128 --out cleaned.png
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Command } from "commander";

const program = new Command();
program
  .name("clean-alpha")
  .description("透過PNGのアルファチャンネルを二値化してハロを除去")
  .argument("<file>", "入力PNGファイル")
  .option("--threshold <n>", "アルファ閾値 (0-255)。これ以上を不透明、未満を透明にする", "128")
  .option("--out <file>", "出力ファイル（省略時は上書き）")
  .parse();

const inputFile = path.resolve(program.args[0]);
const opts = program.opts();
const threshold = parseInt(opts.threshold, 10);
const outputFile = opts.out ? path.resolve(opts.out) : inputFile;

async function main() {
  if (!fs.existsSync(inputFile)) {
    console.error(`[error] File not found: ${inputFile}`);
    process.exit(1);
  }

  const image = sharp(inputFile);
  const { width, height, channels } = await image.metadata();

  if (channels !== 4) {
    console.log(`[skip] ${inputFile} has ${channels} channels (no alpha)`);
    return;
  }

  // Raw pixel data (RGBA)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  let cleaned = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < threshold) {
      // 透明にする（RGB も 0 にしてハロの色残りを除去）
      data[i] = 0;
      data[i - 1] = 0;
      data[i - 2] = 0;
      data[i - 3] = 0;
      cleaned++;
    } else {
      data[i] = 255; // 完全不透明
    }
  }

  const totalPixels = width * height;
  const pct = ((cleaned / totalPixels) * 100).toFixed(1);

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outputFile);

  const sizeBefore = fs.statSync(inputFile).size;
  const sizeAfter = fs.statSync(outputFile).size;
  console.log(
    `Done: ${path.basename(outputFile)} — ${cleaned}px cleaned (${pct}%), ${(sizeBefore / 1024).toFixed(0)}KB → ${(sizeAfter / 1024).toFixed(0)}KB`
  );
}

main().catch((err) => {
  console.error("[error]", err.message || err);
  process.exit(1);
});
