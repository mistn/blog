/* eslint-disable no-console */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const isCloudflare = process.env.CF_PAGES === "1" || process.env.ADAPTER === "cloudflare";
const sourceDir = resolve(isCloudflare ? "dist/pagefind" : ".vercel/output/static/pagefind");
const targetDir = resolve("public/pagefind");

if (!existsSync(sourceDir)) {
  console.error(`Pagefind output was not found: ${sourceDir}`);
  process.exit(1);
}

try {
  mkdirSync(resolve("public"), { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });
} catch (error) {
  console.error(`Failed to copy pagefind output: ${error.message}`);
  process.exit(1);
}
