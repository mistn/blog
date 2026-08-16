# miuarc's blog

Astro v5 个人博客。Keystatic 在线管理后台。

## 运行

```bash
pnpm install
pnpm dev
pnpm build
pnpm anime:sync
```

## 环境变量

复制 `.env.example` 为 `.env`。**部署（Vercel）只需配置以下几项**，本地开发只需 `UPROBOT_API_KEY` 即可。

### 必填（部署）

| 变量 | 本地 | 生产 | 说明 |
|------|------|------|------|
| `ADMIN_USER` | 可选 | 推荐 | 后台登录用户名，默认 `admin` |
| `ADMIN_PASS` | 留空 | 必填 | 后台登录密码，留空则跳过鉴权 |
| `KEYSTATIC_GITHUB_CLIENT_ID` | 留空 | 必填 | GitHub OAuth App Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | 留空 | 必填 | GitHub OAuth App Client Secret |
| `KEYSTATIC_SECRET` | 留空 | 必填 | 任意随机长字符串，用作加密密钥，可用 `openssl rand -hex 32` 生成 |
| `UPROBOT_API_KEY` | 可选 | 可选 | 只读 API Key，[这里获取](https://dashboard.uptimerobot.com/integrations)，没有则监控接口报错 |

> GitHub OAuth App 创建：`Settings > Developer settings > OAuth Apps`，
> Callback URL 填 `https://你的域名/api/keystatic/github/oauth/callback`

### 可选

| 变量 | 说明 |
|------|------|
| `GITHUB_TOKEN` | Anki Stats 接口用 |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 验证码 |

### GitHub Actions（定时追番同步）

`ANILIST_USER_NAME`（AniList 用户名）由 `.github/workflows/anime-sync.yml` 定时拉取并提交动画数据，需填入 **GitHub Actions Secrets**：

仓库 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

> Vercel 不需要此变量，构建（`pnpm build`）不跑 `anime:sync`。

## 部署

目前仅支持 **Vercel**，Cloudflare Pages 支持后续补充。

### Vercel

1. Fork 仓库，Vercel 导入项目
2. 环境变量填入 Vercel 后台
3. Vercel 自动识别 `framework: "astro"`，完成

`output: "static"`，静态页面走 CDN，`/keystatic` 和 `/api/keystatic` 走 Serverless Function。

## License

MIT
