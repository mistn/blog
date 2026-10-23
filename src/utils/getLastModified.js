import { execFileSync } from "node:child_process";

export function getLastModified(file) {
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", file],
      {
        cwd: process.cwd(),
        encoding: "utf8",
      }
    ).trim();
    return date || null;
  } catch {
    return null;
  }
}
