/* eslint-disable no-console */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// 与 astro.config.ts 保持一致的平台判定：显式 ADAPTER 优先，否则看 CF_PAGES
process.env.ADAPTER = "cloudflare";
process.env.CF_PAGES = process.env.CF_PAGES || "1";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    console.error(`${command} exited with code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

run("npx", ["astro", "check"]);
run("npx", ["astro", "build"]);
run("npx", ["pagefind", "--site", "dist"]);

const sourceDir = resolve("dist/pagefind");
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
