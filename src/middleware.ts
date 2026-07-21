import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 只保护管理后台前台页面，API 路由由 Keystatic 自己的 GitHub OAuth 鉴权
  if (!url.pathname.startsWith("/keystatic")) {
    return next();
  }

  // GitHub OAuth 回调无需 Basic Auth
  if (url.pathname === "/keystatic/github/callback") {
    return next();
  }

  // 未设密码则跳过 Basic Auth
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) {
    return next();
  }

  const auth = context.request.headers.get("authorization");
  if (!auth) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const [user, pass] = atob(encoded).split(":");

  if (user !== adminUser || pass !== adminPass) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  return next();
});
