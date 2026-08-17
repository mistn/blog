# miuarc's blog

个人博客。纯静态 Astro 站点。

> 本仓库 `main` 分支为纯静态版（无后台、无 SSR，任何静态托管均可部署）。
> 需要 **Keystatic 在线后台 / 双平台部署（Vercel + Cloudflare Workers）** 的旧版，
> 见 [`backup/with-keystatic`](https://github.com/mistn/blog/tree/backup/with-keystatic) 分支。

## 站点预览

| 桌面端                                              | 移动端                                            |
| --------------------------------------------------- | ------------------------------------------------- |
| ![desktop](/docs/screenshots/site-home-desktop.png) | ![mobile](/docs/screenshots/site-home-mobile.png) |

## 运行

```bash
pnpm install
pnpm dev
pnpm build
pnpm anime:sync
```

## 环境变量

复制 `.env.example` 为 `.env`。构建只需 `UPROBOT_API_KEY`。

| 变量                | 必填   | 说明                                                                                                  |
| ------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| `UPROBOT_API_KEY`   | 构建时 | [这里获取](https://dashboard.uptimerobot.com/integrations)，用于生成监控数据 JSON；没有则监控面板报错 |
| `ANILIST_USER_NAME` | 可选   | AniList 用户名，追番同步用（见下）                                                                    |

> 数据为**构建期快照**：Anki 数据直接读取公开 gist，监控数据构建时抓取一次生成 JSON，部署后随下次构建刷新。

## 构建与部署

`pnpm build` 输出纯静态产物到 `dist/`（含 pagefind 搜索索引），无任何运行时依赖，可直接部署到任意静态托管。

### Vercel

1. Fork 本仓库
2. Vercel 控制台 → Add New → Project，导入你 fork 的仓库
3. 环境变量填入 `UPROBOT_API_KEY`（构建时需要）
4. Deploy 完成

### Cloudflare Pages

1. Fork 本仓库
2. 在 **GitHub Actions Secrets**（`Settings → Secrets and variables → Actions`）中配置：

   | Secret                  | 说明                            |
   | ----------------------- | ------------------------------- |
   | `CLOUDFLARE_API_TOKEN`  | CF API Token，需 Pages 编辑权限 |
   | `CLOUDFLARE_ACCOUNT_ID` | CF 账号 ID（控制台地址栏）      |
   | `UPROBOT_API_KEY`       | 构建时生成监控数据用            |

3. 推 `main` 或手动 Run `Deploy to Cloudflare Pages` workflow，自动构建并部署
4. 首次需先在 CF 控制台创建 Pages 项目 `miuarc-blog`

### 其他静态托管

任何能运行 `pnpm build` 的平台都行（Netlify、GitHub Pages 等），构建命令 `pnpm build`，输出目录 `dist`。

## GitHub Actions（可选）：定时追番同步

`ANILIST_USER_NAME`（AniList 用户名）由 `.github/workflows/anime-sync.yml` 定时拉取并提交动画数据，需填入 **GitHub Actions Secrets**：

仓库 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

> 不配置则跳过此定时任务；该 workflow 只提交数据文件，不影响站点构建。

## License

MIT
