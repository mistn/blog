// Vercel Edge Middleware — 保护 /keystatic 管理后台
// 本地 dev 不生效（localhost 只有自己能访问）；部署到 Vercel 后自动运行
export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (
    !url.pathname.startsWith("/keystatic") &&
    !url.pathname.startsWith("/api/keystatic")
  ) {
    return;
  }

  const auth = request.headers.get("authorization");
  if (!auth) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="管理后台"' },
    });
  }

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="管理后台"' },
    });
  }

  const [user, pass] = atob(encoded).split(":");

  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) {
    // 未设置密码则放行（但会在控制台报 warning）
    return;
  }

  if (user !== adminUser || pass !== adminPass) {
    return new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="管理后台"' },
    });
  }
}
