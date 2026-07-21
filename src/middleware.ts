import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 未设密码则跳过所有鉴权
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) {
    return next();
  }

  const token = context.cookies.get("admin_token")?.value;
  const expected = btoa(`${adminUser}:${adminPass}`);

  // 已有 token 还访问登录页 → 直接跳转后台
  if (url.pathname === "/login" && token === expected) {
    return context.redirect("/keystatic");
  }

  // 登录页和 API 路由不需要鉴权
  if (
    url.pathname === "/login" ||
    url.pathname === "/keystatic/github/callback" ||
    !url.pathname.startsWith("/keystatic")
  ) {
    return next();
  }

  // 无 token 或 token 不匹配 → 跳转登录页
  if (token !== expected) {
    return context.redirect("/login");
  }

  return next();
});
