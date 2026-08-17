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

| 变量                     | 必填 | 说明                                                                                                                                                                                                                                                                                |
| ------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_UPROBOT_API_KEY` | 可选 | UptimeRobot **只读** key（`ur...`），仅用于查询监控状态；通过 `PUBLIC_` 前缀注入前端，浏览器端实时 fetch，不配则不显示监控面板。申请：UptimeRobot → [**My Settings → API Settings → Monitor-specific API keys**](https://dashboard.uptimerobot.com/)（勾选 _Allow Read-Only_ 生成） |

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

1. Cloudflare 控制台 → **Workers & Pages → Create → Pages → Connect to Git**，选择本仓库 `main` 分支
2. 构建设置：

   | 项目         | 值               |
   | ------------ | ---------------- |
   | 框架预设     | 无（或选 Astro） |
   | 构建命令     | `pnpm build`     |
   | 构建输出目录 | `dist`           |
   | 根目录       | `/`              |

3. 环境变量（高级）填入：

   | 变量                     | 说明                                                             |
   | ------------------------ | ---------------------------------------------------------------- |
   | `PUBLIC_UPROBOT_API_KEY` | UptimeRobot 只读 key（申请见上文"环境变量"表），浏览器直连监控用 |

4. Save and Deploy 完成，之后每次推 `main` 自动构建部署

> 采用 CF 原生 Git 集成，无需 GitHub Actions 部署 workflow。

### 其他静态托管

任何能运行 `pnpm build` 的平台都行（Netlify、GitHub Pages 等），构建命令 `pnpm build`，输出目录 `dist`。

> 本仓库 `main` 分支为纯静态版（无后台、无 SSR，任何静态托管均可部署）。
> 需要 **Keystatic 在线后台 / 双平台部署（Vercel + Cloudflare Workers）** 的旧版，
> 见 [`backup/with-keystatic`](https://github.com/mistn/blog/tree/backup/with-keystatic) 分支。

## License

MIT
