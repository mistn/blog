# miuarc's blog

个人博客。纯静态 Astro 站点。

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

复制 `.env.example` 为 `.env`。

| 变量                     | 必填 | 说明                                                                                                                          |
| ------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_UPROBOT_API_KEY` | 可选 | UptimeRobot **只读** key（`ur...`），仅用于查询监控状态；通过 `PUBLIC_` 前缀注入前端，浏览器端实时 fetch，不配则不显示监控面板。申请：UptimeRobot → [**My Settings → API Settings → Monitor-specific API keys**](https://dashboard.uptimerobot.com/)（勾选 *Allow Read-Only* 生成） |

> 数据均为**浏览器端实时获取**：Anki 直连公开 gist，监控直连 UptimeRobot API。无需构建期抓取，每次打开页面均为最新数据。

## 构建与部署

`pnpm build` 输出纯静态产物到 `dist/`（含 pagefind 搜索索引），无任何运行时依赖，可直接部署到任意静态托管。

### Vercel

1. Fork 本仓库
2. Vercel 控制台 → Add New → Project，导入你 fork 的仓库
3. 环境变量填入 `PUBLIC_UPROBOT_API_KEY`
4. Deploy 完成
5. （可选）定时追番同步：在 GitHub Actions Secrets 配置 `ANILIST_USER_NAME`

### Cloudflare Pages

1. Fork 本仓库
2. 在 **GitHub Actions Secrets**（`Settings → Secrets and variables → Actions`）中配置：

   | Secret                  | 说明                                                                                  |
   | ----------------------- | ------------------------------------------------------------------------------------- |
   | `CLOUDFLARE_API_TOKEN`  | CF API Token，需 Pages 编辑权限。申请：Cloudflare → **My Profile → API Tokens → Create Token**，选模板 *Edit Cloudflare Workers*，并给该 Token 加上 Workers Scripts / Pages 的 *Edit* 权限 |
   | `CLOUDFLARE_ACCOUNT_ID` | CF 账号 ID。位置：Cloudflare 各页面右上角头像 → **My Profile → 页面底部**可得账号 ID（账户区域概述右栏） |
   | `UPROBOT_API_KEY`       | 构建时注入为 `PUBLIC_UPROBOT_API_KEY`，浏览器直连监控用。申请见上文"环境变量"表      |
   | `ANILIST_USER_NAME`     | （可选）AniList 用户名，定时追番同步用；不配置则跳过该任务。即 [anilist.co](https://anilist.co) 账号用户名 |

3. 推 `main` 或手动 Run `Deploy to Cloudflare Pages` workflow，自动构建并部署
4. 首次需先在 CF 控制台创建 Pages 项目 `miuarc-blog`
5. （可选）定时追番同步已在第 2 步配置 `ANILIST_USER_NAME` 即启用

### 其他静态托管

任何能运行 `pnpm build` 的平台都行（Netlify、GitHub Pages 等），构建命令 `pnpm build`，输出目录 `dist`。

> 本仓库 `main` 分支为纯静态版（无后台、无 SSR，任何静态托管均可部署）。
> 需要 **Keystatic 在线后台 / 双平台部署（Vercel + Cloudflare Workers）** 的旧版，
> 见 [`backup/with-keystatic`](https://github.com/mistn/blog/tree/backup/with-keystatic) 分支。

## License

MIT
