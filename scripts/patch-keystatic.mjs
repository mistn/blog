import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function patchCore(target) {
  if (!fs.existsSync(target)) {
    console.log("Keystatic core API file not found, skipping");
    return false;
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
    content = content.replace(
      /if \(!tokenRes\.ok\) \{\n\s+return \{\n\s+status: 401,\n\s+body: 'Authorization failed'\n\s+\};/,
      `if (!tokenRes.ok) {\n    const ghBody = await tokenRes.text();\n    return {\n      status: 401,\n      headers: { 'Content-Type': 'text/plain; charset=utf-8' },\n      body: \`[PATCH-OK] GitHub: \${tokenRes.status} \${JSON.stringify(ghBody)}\`\n    };`
    );

    content = content.replace(
      /catch \{\n\s+return \{\n\s+status: 401,\n\s+body: 'Authorization failed'\n\s+\};/,
      `catch {\n    return {\n      status: 401,\n      headers: { 'Content-Type': 'text/plain; charset=utf-8' },\n      body: \`[PATCH-OK] Schema validation failed: \${JSON.stringify(_tokenData)}\`\n    };`
    );
  }

  fs.writeFileSync(target, content);
  return true;
}

function patchOAuth(target) {
  if (!fs.existsSync(target)) {
    return false;
  }
  let content = fs.readFileSync(target, "utf8");
  let changed = false;

  // 3a. Make expires_in, refresh_token, refresh_token_expires_in optional in schema
  // GitHub OAuth Apps don't return these fields
  const schemaOpts = [
    ["  expires_in: s.number(),", "  expires_in: s.optional(s.number()),"],
    ["  refresh_token: s.string(),", "  refresh_token: s.optional(s.string()),"],
    ["  refresh_token_expires_in: s.number(),", "  refresh_token_expires_in: s.optional(s.number()),"],
  ];
  for (const [from, to] of schemaOpts) {
    content = content.replace(from, to);
    if (content.includes(to)) changed = true;
  }

  // 3b. Fix getTokenCookies: don't fail when refresh_token is missing
  // OAuth App tokens don't expire and have no refresh token
  if (content.includes("tokenData.expires_in,") && !content.includes("accessTokenOpts")) {
    content = content.replace(
      /async function getTokenCookies\(tokenData, config\) \{[\s\S]*?return headers;[\s\n]*\}/,
      `async function getTokenCookies(tokenData, config) {
  const accessTokenOpts = {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  };
  if (tokenData.expires_in) {
    accessTokenOpts.maxAge = tokenData.expires_in;
    accessTokenOpts.expires = new Date(Date.now() + tokenData.expires_in * 1000);
  }
  const headers = [['Set-Cookie', cookie.serialize('keystatic-gh-access-token', tokenData.access_token, accessTokenOpts)]];
  if (tokenData.refresh_token) {
    headers.push(['Set-Cookie', cookie.serialize('keystatic-gh-refresh-token', await encryptValue(tokenData.refresh_token, config.secret), {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: tokenData.refresh_token_expires_in,
      expires: new Date(Date.now() + tokenData.refresh_token_expires_in * 100),
      path: '/'
    })]);
  }
  return headers;
}`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(target, content);
  }
  return changed;
}

function patchAstro(target) {
  if (!fs.existsSync(target)) {
    console.log("Keystatic astro API file not found, skipping");
    return false;
  }

  let content = fs.readFileSync(target, "utf8");

  // Replace import.meta.env.KEYSTATIC_* with process.env.KEYSTATIC_*
  // Vite doesn't process import.meta.env in node_modules, so it fails at runtime
  const envVars = [
    "KEYSTATIC_GITHUB_CLIENT_ID",
    "KEYSTATIC_GITHUB_CLIENT_SECRET",
    "KEYSTATIC_SECRET",
  ];
  for (const key of envVars) {
    const from = `import.meta.env.${key}`;
    const to = `process.env.${key}`;
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
    }
  }

  fs.writeFileSync(target, content);
  return true;
}

// Patch the Node.js runtime file (this is what runs on Vercel/Node)
const coreNodeTarget = path.resolve(
  __dirname,
  "../node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js"
);

// Patch the generic file (used by browser/web environments)
const coreTarget = path.resolve(
  __dirname,
  "../node_modules/@keystatic/core/dist/keystatic-core-api-generic.js"
);

// Patch the Astro API handler
const astroTarget = path.resolve(
  __dirname,
  "../node_modules/@keystatic/astro/dist/keystatic-astro-api.js"
);

if (
  !fs.existsSync(coreNodeTarget) &&
  !fs.existsSync(coreTarget) &&
  !fs.existsSync(astroTarget)
) {
  console.log("Keystatic files not found, skipping patch");
  process.exit(0);
}

let patched = false;
if (fs.existsSync(coreNodeTarget)) {
  patched = patchCore(coreNodeTarget) || patched;
  patched = patchOAuth(coreNodeTarget) || patched;
}
if (fs.existsSync(coreTarget)) {
  patched = patchCore(coreTarget) || patched;
  patched = patchOAuth(coreTarget) || patched;
}
if (fs.existsSync(astroTarget)) {
  patched = patchAstro(astroTarget) || patched;
}

if (patched) {
  console.log("Keystatic patched successfully");
} else {
  console.log("Keystatic already patched, no changes needed");
}
