# miuo's blog

Astro v5 个人博客。Keystatic 在线管理后台 + 中英双语。

## 运行

```bash
pnpm install
pnpm dev
pnpm build
pnpm anime:sync
```

## 环境变量

复制 `.env.example` 为 `.env`，填入实际值。

### 管理后台

| 变量 | 必填 | 说明 |
|------|------|------|
| `ADMIN_USER` | | Basic Auth 用户名，默认 `admin` |
| `ADMIN_PASS` | | Basic Auth 密码。**本地无需，部署必填** |
| `KEYSTATIC_GITHUB_CLIENT_ID` | 生产 | GitHub OAuth App Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | 生产 | GitHub OAuth App Client Secret |
| `KEYSTATIC_SECRET` | 生产 | 任意随机字符串，用作加密密钥 |

> GitHub OAuth App 创建：`Settings > Developer settings > OAuth Apps`，
> Callback URL 填 `https://你的域名/api/keystatic/github/oauth/callback`

### UptimeRobot 监控

| 变量 | 必填 | 说明 |
|------|------|------|
| `UPROBOT_API_KEY` | 是 | 只读 API Key，[这里获取](https://dashboard.uptimerobot.com/integrations) |

### 追番同步

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ANILIST_USER_NAME` | `miuo55`（硬编码在脚本中） | AniList 用户名 |
| `ANILIST_USER_ID` | | AniList 用户 ID，优先于用户名 |

### 可选

| 变量 | 说明 |
|------|------|
| `GITHUB_TOKEN` | Anki Stats 接口用 |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 验证码 |

## 部署（Vercel）

1. Fork 仓库，Vercel 导入项目
2. 环境变量填入 Vercel 后台
3. Vercel 自动识别 `framework: "astro"`，完成

`output: "static"`，静态页面走 CDN，`/keystatic` 和 `/api/keystatic` 走 Serverless Function。

## License

MIT
