import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  if (
    !url.pathname.startsWith("/keystatic") &&
    !url.pathname.startsWith("/api/keystatic")
  ) {
    return next();
  }

  // GitHub OAuth 回调无需 Basic Auth，否则会拦截第二次
  if (url.pathname === "/keystatic/github/callback") {
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

  const adminUser = import.meta.env.ADMIN_USER || "admin";
  const adminPass = import.meta.env.ADMIN_PASS;
  if (!adminPass) {
    return next();
  }

  if (user !== adminUser || pass !== adminPass) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  return next();
});
