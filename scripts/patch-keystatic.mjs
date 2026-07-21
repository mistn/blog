import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(
  __dirname,
  "../node_modules/@keystatic/core/dist/keystatic-core-api-generic.js"
);

if (!fs.existsSync(target)) {
  console.log("Keystatic API file not found, skipping patch");
  process.exit(0);
}

let content = fs.readFileSync(target, "utf8");

// 1. Add redirect_uri to GitHub token exchange
const tokenExchangeSection = content.indexOf("login/oauth/access_token");
const afterTokenExchange = content.indexOf("};", tokenExchangeSection);
const tradeSection = content.substring(tokenExchangeSection, afterTokenExchange + 2);
if (!tradeSection.includes("redirect_uri")) {
  content = content.replace(
    /(url\.searchParams\.set\('code', code\);)([\r\n\s]*)(const tokenRes = await fetch\()/,
    "$1\n  url.searchParams.set('redirect_uri', `${new URL(req.url).origin}/api/keystatic/github/oauth/callback`);\n  $3"
  );
}

// 2. Add error details to 401 responses (only if not already present)
if (!content.includes("[PATCH-OK]")) {
  // First 401: GitHub token endpoint rejected
  content = content.replace(
    /if \(!tokenRes\.ok\) \{\n\s+return \{\n\s+status: 401,\n\s+body: 'Authorization failed'\n\s+\};/,
    `if (!tokenRes.ok) {\n    const ghBody = await tokenRes.text();\n    return {\n      status: 401,\n      headers: { 'Content-Type': 'text/plain; charset=utf-8' },\n      body: \`[PATCH-OK] GitHub: \${tokenRes.status} \${JSON.stringify(ghBody)}\`\n    };`
  );

  // Second 401: schema validation failed
  content = content.replace(
    /catch \{\n\s+return \{\n\s+status: 401,\n\s+body: 'Authorization failed'\n\s+\};/,
    `catch {\n    return {\n      status: 401,\n      headers: { 'Content-Type': 'text/plain; charset=utf-8' },\n      body: \`[PATCH-OK] Schema validation failed: \${JSON.stringify(_tokenData)}\`\n    };`
  );
}

fs.writeFileSync(target, content);
console.log("Keystatic patched successfully");
