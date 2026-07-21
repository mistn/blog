import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 只保护管理后台前台页面，API 路由由 Keystatic 自己的 GitHub OAuth 鉴权
  if (!url.pathname.startsWith("/keystatic")) {
    return next();
  }

  // 登录页面本身不需要鉴权
  if (url.pathname === "/keystatic/login") {
    return next();
  }

  // GitHub OAuth 回调无需鉴权
  if (url.pathname === "/keystatic/github/callback") {
    return next();
  }

  // 未设密码则跳过鉴权
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) {
    return next();
  }

  // 检查 session cookie
  const token = context.cookies.get("admin_token")?.value;
  const expected = btoa(`${adminUser}:${adminPass}`);

  if (token !== expected) {
    return context.redirect("/keystatic/login");
  }

  return next();
});
