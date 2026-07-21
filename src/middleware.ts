import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 登录页和 API 路由不需要鉴权
  if (
    url.pathname === "/login" ||
    url.pathname === "/keystatic/github/callback" ||
    !url.pathname.startsWith("/keystatic")
  ) {
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
    return context.redirect("/login");
  }

  return next();
});
