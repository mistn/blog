![en](https://img.shields.io/badge/lang-en-blue) ![zh](https://img.shields.io/badge/lang-zh-crimson)

# miuo's blog

<https://blog.miuo.me/>

---

## English

A personal blog built on [AstroPaper](https://github.com/satnaing/astro-paper) with heavy customizations.

### Features

- **Bilingual** — English and Chinese content via `/en/` path prefix, UI strings managed in `src/i18n.ts`
- **AniList Integration** — Weekly auto-sync of completed anime, displayed in card grids grouped by year
- **Friend Links** — Vertical card layout, exchange via [Artalk](https://artalk.js.org/) comments
- **Offline Search** — Full-text search powered by [Pagefind](https://pagefind.app/)
- **Auto OG Images** — Social share images generated at build with Satori

### Tech Stack

**Framework:** Astro v5 · TypeScript · Tailwind CSS v4  
**Features:** Shiki · KaTeX · Pagefind · Satori + Sharp · Artalk  
**Tooling:** ESLint · Prettier · GitHub Actions

### Local Development

```bash
pnpm install
pnpm dev       # dev server at localhost:4321
pnpm build     # production build
pnpm preview   # preview build
```

### Deploy

**Docker**
```bash
docker compose up -d
# or manually:
docker build -t miuo-blog .
docker run -p 4321:80 miuo-blog
```

**Cloudflare Pages**
1. Push to GitHub, connect repo in Cloudflare Pages
2. Build preset: Astro, command: `pnpm build`, output: `dist`, Node.js 20+

### License

MIT

---

## 中文

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 深度定制的个人博客。

### 功能

- **中英双语** — 通过 `/en/` 路径前缀自动切换，UI 文案统一在 `src/i18n.ts` 管理
- **AniList 追番** — 每周自动同步已看完的动画，卡片网格展示，按年份分组
- **友链交换** — 垂直名片式卡片布局，通过 Artalk 评论区交换
- **静态搜索** — Pagefind 离线全文搜索
- **文章 OG 图片** — 构建时用 Satori 自动生成社交分享图

### 技术栈

**框架:** Astro v5 · TypeScript · Tailwind CSS v4  
**功能:** Shiki · KaTeX · Pagefind · Satori + Sharp · Artalk  
**工具:** ESLint · Prettier · GitHub Actions

### 本地运行

```bash
pnpm install
pnpm dev       # 启动开发服务器
pnpm build     # 生产构建
pnpm preview   # 预览构建
```

### 部署

**Docker**
```bash
docker compose up -d
# 或手动构建
docker build -t miuo-blog .
docker run -p 4321:80 miuo-blog
```

**Cloudflare Pages**
1. 推送到 GitHub，在 Cloudflare Pages 连接仓库
2. 框架预设 Astro，构建命令 `pnpm build`，输出目录 `dist`，Node.js 20+

### 许可

MIT
