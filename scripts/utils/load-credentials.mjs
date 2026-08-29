import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, "..", ".env");

export function loadCredentialsPath() {
  try {
    const content = fs.readFileSync(ENV_PATH, "utf-8");
    const match = content.match(/^GOOGLE_CREDENTIALS_PATH=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // fall through
  }
  if (process.env.GOOGLE_CREDENTIALS_PATH) return process.env.GOOGLE_CREDENTIALS_PATH;
  console.error("[error] GOOGLE_CREDENTIALS_PATH is not set (check scripts/.env or environment variables)");
  process.exit(1);
}
