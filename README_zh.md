# miuo's blog

<p align="center">
  <a href="./README.md">English</a> | 简体中文
</p>

<p align="center">
  <a href="https://astro.build/"><img src="https://img.shields.io/badge/Tech-Astro-FF5D01?style=flat-square&logo=astro&logoColor=fff" alt="Astro"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Lang-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/CSS-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"></a>
</p>

## 功能

- **中英双语** — 通过 `/en/` 路径前缀切换，UI 文案统一在 `src/i18n.ts` 管理
- **AniList 追番** — 每周自动同步已看完的动画，卡片网格展示
- **友链交换** — 通过 Artalk 评论区交换，数据在 `src/data/friends.ts`
- **离线搜索** — Pagefind 全文搜索
- **自动 OG 图片** — 构建时为每篇文章生成社交分享图（Satori + Sharp）
- **KaTeX** — 行内与块级数学公式
- **Shiki** — 双主题代码高亮，支持文件名、diff 与 highlight 注解
- **GitHub 风格提示块** — `> [!tip]` / `[!note]` / `[!warning]` 语法
- **深浅色模式** — `data-theme` 属性驱动，跟随系统或手动切换
- **响应式设计** — 移动端适配
- **RSS & Sitemap** — 自动生成
- **统一分页** — 带省略号截断的分页组件，首页、文章列表、标签页复用

## 目录结构

```
/
├── public/                    # 静态资源
├── src/
│   ├── assets/icons/          # 26 个 SVG 出线图标
│   ├── components/            # 19 个可复用组件
│   │   ├── Pagination.astro   # 分页（省略号截断 + 中英双语）
│   │   ├── SiteTopbar.astro   # 顶栏（Logo、导航、搜索、主题切换）
│   │   ├── HomeTabs.astro     # 桌面端导航标签
│   │   ├── CodeSnippet.astro  # 代码块（含复制按钮）
│   │   ├── BackToTopButton.astro
│   │   ├── TableOfContents.astro
│   │   ├── ArtalkComments.astro
│   │   ├── Card.astro / Datetime.astro / Tag.astro
│   │   ├── Header.astro / Footer.astro / Socials.astro
│   │   ├── ShareLinks.astro / LinkButton.astro / EditPost.astro
│   │   ├── Breadcrumb.astro / BackButton.astro / PageHeader.astro
│   │   └── ArticleImageLightbox.astro
│   ├── data/
│   │   ├── blog/              # 15 篇 Markdown/MDX 文章
│   │   ├── anime.generated.json
│   │   └── friends.ts
│   ├── layouts/               # Layout, PostDetails, Main, AboutLayout
│   ├── pages/
│   │   ├── index.astro        # 首页（分页）
│   │   ├── about.md / anime.astro / friends.astro / search.astro / 404.astro
│   │   ├── posts/             # 文章详情 + 分页列表 + 每篇文章 OG 图生成
│   │   ├── tags/              # 标签聚合 + 分页筛选
│   │   ├── archives/
│   │   └── en/                # 英文版页面（镜像结构）
│   ├── scripts/               # theme.ts, back-button-fallback.ts
│   ├── styles/
│   │   ├── global.css         # Tailwind v4 配置
│   │   └── typography.css     # 排版与代码块样式
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 15 个工具模块（OG 模板、rehype 插件等）
│   ├── config.ts              # 站点配置
│   ├── constants.ts           # 社交链接与分享配置
│   ├── content.config.ts      # 内容集合 Schema
│   └── i18n.ts                # 中英文 UI 文案
├── scripts/
│   ├── sync-anime.mjs
│   └── copy-pagefind.mjs
├── .github/workflows/
│   ├── ci.yml
│   └── anime-sync.yml
├── Dockerfile
├── docker-compose.yml
├── astro.config.ts
└── package.json
```

## 技术栈

| 领域 | 技术 |
|------|------|
| 框架 | [Astro](https://astro.build/) v5 |
| 语言 | TypeScript |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) v4 + `@tailwindcss/typography` |
| 搜索 | [Pagefind](https://pagefind.app/) |
| 代码高亮 | [Shiki](https://shiki.style/) |
| 数学公式 | [KaTeX](https://katex.org/) |
| OG 图片 | [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) |
| 评论 | [Artalk](https://artalk.js.org/) |
| 格式化 | Prettier + `prettier-plugin-astro` |
| Lint | ESLint Flat Config |
| CI/CD | GitHub Actions |
| 部署 | Vercel / Cloudflare Pages / Docker |

## 本地运行

```bash
pnpm install
pnpm dev       # localhost:4321
pnpm build     # astro check && astro build + Pagefind 索引
pnpm preview   # 预览构建
```

### Docker

```bash
docker compose up -d
```

### Cloudflare Pages

| 配置项 | 值 |
|--------|-----|
| 框架预设 | Astro |
| 构建命令 | `pnpm build` |
| 输出目录 | `dist` |
| Node.js | 20+ |

### Vercel

自动识别 Astro 项目，导入仓库即可。

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 + Pagefind |
| `pnpm preview` | 预览构建 |
| `pnpm sync` | 生成 Astro 类型 |
| `pnpm anime:sync` | 同步 AniList 数据 |
| `pnpm format` | Prettier 格式化 |
| `pnpm lint` | ESLint 检查 |

## 站点配置

编辑 `src/config.ts`：
- `website` / `author` / `title` / `desc`
- `postPerPage` — 每页文章数（默认 4）
- `lightAndDarkMode` — 深浅色切换
- `editPost` — 文章底部"编辑此页"链接

## 自定义

- **追番**：`pnpm anime:sync` 同步 AniList，GitHub Actions 每周自动执行
- **友链**：编辑 `src/data/friends.ts`
- **双语**：UI 文案在 `src/i18n.ts`，英文页面在 `src/pages/en/`
- **文章**：Markdown 放在 `src/data/blog/`，需 `title` / `pubDatetime` / `description` / `tags`

## License

MIT

---

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 构建，由 [miuo](https://blog.miuo.me/) 维护。
