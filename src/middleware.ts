import { defineMiddleware } from "astro/middleware";
import { serverEnv } from "@/utils/serverEnv";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Cloudflare (adapter v13+/Astro v6) 移除了 Astro.locals.runtime.env；
  // 适配器在 locals.runtime 上置入了不可重定义的、会抛错的 env getter。
  // 这里改为：仅在 CF 运行时（locals.runtime 存在）于其内部覆盖 env 项，
  // 使 /api/keystatic/... 能读到构建期内联的 KEYSTATIC_* 密钥。
  // Vercel 无 locals.runtime，此分支不执行，keystatic 照旧走 process.env，行为不变。
  const cfLocals = (context.locals as unknown as Record<string, unknown>).runtime;
  if (cfLocals && typeof cfLocals === "object") {
    const keystaticEnv = {
      KEYSTATIC_GITHUB_CLIENT_ID: import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
      KEYSTATIC_GITHUB_CLIENT_SECRET: import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      KEYSTATIC_SECRET: import.meta.env.KEYSTATIC_SECRET,
    };
    try {
      Object.defineProperty(cfLocals, "env", {
        configurable: true,
        writable: true,
        value: keystaticEnv,
      });
    } catch {
      // 若 env 也不可重定义，静默放弃（keystatic 密钥在 CF 上不可用，其余功能不受影响）
    }
  }

  // 未设密码则跳过所有鉴权
  const adminUser = serverEnv("ADMIN_USER") || "admin";
  const adminPass = serverEnv("ADMIN_PASS");
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
