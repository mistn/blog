# miuarc's blog

个人博客。Keystatic 在线管理后台。

## 站点预览

| 桌面端 | 移动端 |
| --- | --- |
| ![desktop](/docs/screenshots/site-home-desktop.png) | ![mobile](/docs/screenshots/site-home-mobile.png) |

## 后台预览

| 首页 | 写文章 | 编辑友链 |
| --- | --- | --- |
| ![home](/docs/screenshots/keystatic-home.png) | ![editor](/docs/screenshots/keystatic-editor.png) | ![friends](/docs/screenshots/keystatic-friends.png) |

## 运行

```bash
pnpm install
pnpm dev
pnpm build
pnpm anime:sync
```

## 环境变量

复制 `.env.example` 为 `.env`，本地开发只需 `UPROBOT_API_KEY` 即可。

> 部署环境变量各平台独立配置，见下文对应部署章节。

`KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` 来自你创建的 GitHub OAuth App，创建步骤见下节。

## GitHub OAuth App

Keystatic 后台登录靠 GitHub OAuth 完成，需要创建一个 OAuth App 获取凭据：

1. GitHub → `Settings` → `Developer settings` → `OAuth Apps` → **New OAuth App**
2. 填写：
   - Application name：任意，如 `my-blog`
   - Homepage URL：`https://你的域名`
   - Authorization callback URL：`https://你的域名/api/keystatic/github/oauth/callback`
3. 点击 **Register application**。创建完成后页面显示 **Client ID**，即为 `KEYSTATIC_GITHUB_CLIENT_ID`
4. 点击 **Generate a new client secret**，生成后**只显示一次**，即为 `KEYSTATIC_GITHUB_CLIENT_SECRET`（忘了只能重新生成）

> 回调 URL 必须和实际部署域名一致；Vercel 和 CF 若用不同域名，需各创建一个 OAuth App。

## 部署

默认构建（不设置任何变量）即为 Vercel 产物；设 `ADAPTER=cloudflare`（或 `CF_PAGES=1`）即 Cloudflare Workers 产物。

### Vercel

1. Fork 本仓库
2. Vercel 控制台 → Add New → Project，导入你 fork 的仓库
3. 在 **Vercel 环境变量**（Environment Variables）中配置：

   | 变量 | 必填 | 说明 |
   |------|------|------|
   | `ADMIN_USER` | 推荐 | 后台登录用户名，默认 `admin` |
   | `ADMIN_PASS` | 必填 | 后台登录密码，留空则跳过鉴权 |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | 必填 | GitHub OAuth App Client ID |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | 必填 | GitHub OAuth App Client Secret |
   | `KEYSTATIC_SECRET` | 必填 | 任意随机长字符串，可用 `openssl rand -hex 32` 生成 |
   | `UPROBOT_API_KEY` | 可选 | [这里获取](https://dashboard.uptimerobot.com/integrations)，没有则监控接口报错 |
   | `GITHUB_TOKEN` | 可选 | Anki Stats 接口用 |

4. 按上节「GitHub OAuth App」创建 App 并取得凭据；还没有的话先创建再配环境变量
5. Deploy 完成，Vercel 自动识别 Astro。

### Cloudflare Workers

1. Fork 本仓库。在 **GitHub Actions Secrets**（`Settings → Secrets and variables → Actions`）中配置：

   | Secret | 说明 |
   |--------|------|
   | `CLOUDFLARE_API_TOKEN` | CF API Token，需 `Workers Scripts: Edit` 权限 |
   | `CLOUDFLARE_ACCOUNT_ID` | CF 账号 ID（控制台地址栏） |
   | `ADMIN_USER` | 后台登录用户名，默认 `admin` |
   | `ADMIN_PASS` | 后台登录密码 |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
   | `KEYSTATIC_SECRET` | 任意随机长字符串 |
   | `UPROBOT_API_KEY` | 可选，监控接口用 |
   | `PUBLIC_UPROBOT_API_KEY` | 可选，监控接口用（需暴露给前端时） |
   | `ANKI_GITHUB_TOKEN` | 可选，Anki Stats 用。注意变量名不能叫 `GITHUB_TOKEN`，会与 GitHub Actions 内置 token 冲突 |
   | `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | 可选，GitHub App slug，默认 `keystatic` |

   > 这里配置的是 GitHub Secrets，**不是** Vercel 环境变量；与 Vercel 值相同的项（如 `ADMIN_PASS`、`UPROBOT_API_KEY`、`KEYSTATIC_SECRET`）保持值一致即可。

2. 按上节「GitHub OAuth App」创建 App（若 CF 域名与 Vercel 不同，需单独创建一个）
3. 推 `main`，或手动 Run `Deploy to Cloudflare Workers` workflow，自动构建并 `wrangler deploy`
4. CF 控制台：Workers → 你的 Worker → Domains → 添加自定义域名

   > Workers 密钥在构建时打入产物（运行时无 `process.env`），修改密钥后需重新 Run workflow。

## GitHub Actions（可选）：定时追番同步

`ANILIST_USER_NAME`（AniList 用户名）由 `.github/workflows/anime-sync.yml` 定时拉取并提交动画数据，需填入 **GitHub Actions Secrets**：

仓库 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

> 不配置则跳过此定时任务；该 workflow 只提交数据文件，不影响站点构建。

## License

MIT