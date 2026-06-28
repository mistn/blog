# miuo's blog

<p align="center">
  English | <a href="./README_zh.md">简体中文</a>
</p>

<p align="center">
  <a href="https://astro.build/"><img src="https://img.shields.io/badge/Tech-Astro-FF5D01?style=flat-square&logo=astro&logoColor=fff" alt="Astro"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Lang-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/CSS-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"></a>
</p>

## Features

- **Bilingual** — English and Chinese content via `/en/` path prefix, UI strings managed in `src/i18n.ts`
- **AniList Integration** — Weekly auto-sync of completed anime, displayed in card grids grouped by year
- **Friend Links** — Vertical card layout, exchange via [Artalk](https://artalk.js.org/) comments
- **Offline Search** — Full-text search powered by [Pagefind](https://pagefind.app/)
- **Auto OG Images** — Social share images generated at build with Satori
- **KaTeX** — Inline and block math rendering
- **Shiki** — Dual-theme code highlighting (github-light / night-owl) with filename, diff & highlight annotations
- **GitHub-style Callouts** — `> [!tip]` / `[!note]` / `[!warning]` syntax, Obsidian-style rendering
- **Dark/Light Mode** — `data-theme` attribute driven, follows system or manual toggle
- **Responsive Design** — Mobile full-screen navigation, adaptive card layout
- **RSS & Sitemap** — Auto-generated
- **Draft & Pagination** — Filter by publish date, paginated index and archive

## Directory Structure

```
/
├── public/                    # Static assets (avatar, favicon, Pagefind index)
├── src/
│   ├── assets/
│   │   └── icons/             # 26 SVG outline icons
│   ├── components/            # 20 reusable components
│   │   ├── SiteTopbar.astro   # Top bar (logo, nav, search, theme toggle)
│   │   ├── HomeTabs.astro     # Desktop navigation tabs
│   │   ├── CodeSnippet.astro  # Code block with copy button
│   │   ├── BackToTopButton.astro  # Glassmorphism floating back-to-top
│   │   ├── TableOfContents.astro  # Floating TOC modal
│   │   └── ArtalkComments.astro   # Artalk comment integration
│   ├── data/
│   │   ├── blog/              # Markdown posts
│   │   ├── anime.generated.json   # Auto-synced anime data
│   │   └── friends.ts         # Friend links data
│   ├── layouts/
│   │   ├── Layout.astro       # Global base layout
│   │   ├── PostDetails.astro  # Post detail layout
│   │   ├── Main.astro         # Common page layout
│   │   └── AboutLayout.astro  # About page layout
│   ├── pages/
│   │   ├── index.astro        # Home (paginated post list)
│   │   ├── about.md           # About page
│   │   ├── anime.astro        # Anime grid
│   │   ├── friends.astro      # Friend link cards
│   │   ├── search.astro       # Pagefind search
│   │   ├── 404.astro
│   │   ├── robots.txt.ts
│   │   ├── rss.xml.ts
│   │   ├── og.png.ts          # Default OG image
│   │   ├── archives/          # Archive pages
│   │   ├── posts/             # Post detail + paginated list
│   │   ├── tags/              # Tag aggregation + filter
│   │   └── en/                # English pages
│   ├── scripts/               # Client scripts (theme, back-to-top)
│   ├── styles/
│   │   ├── global.css         # Global styles + Tailwind v4 config
│   │   └── typography.css     # Typography & code block styles
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── config.ts              # Site configuration
│   ├── constants.ts           # Social links & sharing config
│   ├── content.config.ts      # Content collection schema
│   └── i18n.ts                # Bilingual UI strings
├── scripts/
│   ├── sync-anime.mjs         # AniList anime sync
│   └── copy-pagefind.mjs      # Copy Pagefind assets after build
├── .github/workflows/
│   ├── ci.yml                 # PR build & format check
│   └── anime-sync.yml         # Weekly auto anime sync
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml
├── astro.config.ts
├── package.json
└── pnpm-lock.yaml
```

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | [Astro](https://astro.build/) v5 |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| Search | [Pagefind](https://pagefind.app/) |
| Code Highlight | [Shiki](https://shiki.style/) |
| Math | [KaTeX](https://katex.org/) |
| OG Image | [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) |
| Comments | [Artalk](https://artalk.js.org/) |
| Formatting | [Prettier](https://prettier.io/) + [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) |
| Lint | [ESLint](https://eslint.org/) Flat Config |
| CI/CD | GitHub Actions |
| Deploy | Vercel / Cloudflare Pages / Docker |

## Local Development

```bash
pnpm install
pnpm dev       # Start dev server at localhost:4321
pnpm build     # Production build
pnpm preview   # Preview build
```

### Docker

```bash
docker compose up -d

# or build manually
docker build -t miuo-blog .
docker run -p 4321:80 miuo-blog
```

### Cloudflare Pages

1. Push to GitHub, connect repo in Cloudflare Pages
2. Build settings:

| Config | Value |
|--------|-------|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node.js version | 20+ |

3. Pages auto-rebuilds on every `main` push

### Vercel

1. Push to GitHub, import repo in [Vercel](https://vercel.com)
2. Vercel auto-detects Astro — no config needed
3. Every `main` push triggers a new deployment

Or connect via CLI:

```bash
pnpm dlx vercel        # Deploy preview
pnpm dlx vercel --prod # Deploy to production
```

## Available Commands

| Command | Description |
|---------|------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview build |
| `pnpm sync` | Generate Astro types |
| `pnpm anime:sync` | Sync AniList anime data |
| `pnpm format` | Prettier format |
| `pnpm format:check` | Check format |
| `pnpm lint` | ESLint check |

## Site Configuration

Edit `src/config.ts` to modify:

- `website` — Site URL
- `author` / `title` — Author & title
- `desc` — Site description
- `lightAndDarkMode` — Toggle dark/light mode
- `postPerIndex` / `postPerPage` — Posts per page
- `showArchives` — Show archive page
- `editPost` — "Edit this page" link

## Customization

- **Anime Sync**: Run `pnpm anime:sync` to sync from AniList, generates `src/data/anime.generated.json`. GitHub Actions runs weekly.
- **Friend Links**: Edit `src/data/friends.ts`. Submit via Artalk comments on the friends page.
- **Bilingual Content**: UI strings in `src/i18n.ts`, English pages under `src/pages/en/`, accessible via `/en/` path.
- **Posts**: Markdown files in `src/data/blog/`, frontmatter requires `title`, `pubDatetime`, `description`, `tags`.

## License

MIT

---

Built on [AstroPaper](https://github.com/satnaing/astro-paper), maintained by [miuo](https://blog.miuo.me/).
