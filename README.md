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

- **Bilingual** — English and Chinese, UI strings managed in `src/i18n.ts`, `/en/` path prefix
- **AniList Integration** — Weekly auto-sync of completed anime via GitHub Actions
- **Friend Links** — Exchange via Artalk comments, managed in `src/data/friends.ts`
- **Offline Search** — Full-text search via Pagefind
- **Auto OG Images** — Social share images generated at build with Satori + Sharp
- **KaTeX** — Inline and block math rendering
- **Shiki** — Dual-theme code highlighting with filename, diff & highlight annotations
- **GitHub-style Callouts** — `> [!tip]` / `[!note]` / `[!warning]` syntax
- **Dark/Light Mode** — `data-theme` attribute, follows system or manual toggle
- **Responsive Design** — Mobile navigation, adaptive layout
- **RSS & Sitemap** — Auto-generated
- **Pagination** — Unified `Pagination` component with ellipsis truncation, reused across index, posts, and tag pages

## Directory Structure

```
/
├── public/                    # Static assets
├── src/
│   ├── assets/icons/          # SVG icons
│   ├── components/            # Reusable Astro components
│   │   ├── Pagination.astro   # Pagination with ellipsis & i18n
│   │   ├── SiteTopbar.astro
│   │   ├── CodeSnippet.astro
│   │   ├── BackToTopButton.astro
│   │   ├── TableOfContents.astro
│   │   └── ArtalkComments.astro
│   ├── data/
│   │   ├── blog/              # Markdown posts
│   │   ├── anime.generated.json
│   │   └── friends.ts
│   ├── layouts/               # Layouts (Layout, PostDetails, Main, AboutLayout)
│   ├── pages/                 # Routes: index, about, anime, friends, search, 404
│   │   ├── posts/             # Post detail + paginated list
│   │   ├── tags/              # Tag pages with pagination
│   │   ├── archives/
│   │   └── en/                # English pages (mirrored structure)
│   ├── styles/
│   │   ├── global.css
│   │   └── typography.css
│   ├── utils/                 # Utility functions
│   ├── config.ts              # Site configuration
│   ├── content.config.ts      # Content collection schema
│   └── i18n.ts                # Bilingual UI strings
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

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | [Astro](https://astro.build/) v5 |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + `@tailwindcss/typography` |
| Search | [Pagefind](https://pagefind.app/) |
| Code Highlight | [Shiki](https://shiki.style/) |
| Math | [KaTeX](https://katex.org/) |
| OG Image | [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) |
| Comments | [Artalk](https://artalk.js.org/) |
| Formatting | Prettier + `prettier-plugin-astro` |
| Lint | ESLint Flat Config |
| CI/CD | GitHub Actions |
| Deploy | Vercel / Cloudflare Pages / Docker |

## Local Development

```bash
pnpm install
pnpm dev       # localhost:4321
pnpm build     # Production build + Pagefind indexing
pnpm preview   # Preview build
```

### Docker

```bash
docker compose up -d
```

### Cloudflare Pages

| Config | Value |
|--------|-------|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node.js version | 20+ |

### Vercel

Auto-detects Astro — import repo and deploy.

## Commands

| Command | Description |
|---------|------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build + Pagefind |
| `pnpm preview` | Preview build |
| `pnpm sync` | Generate Astro types |
| `pnpm anime:sync` | Sync AniList data |
| `pnpm format` | Prettier format |
| `pnpm lint` | ESLint check |

## Configuration

Edit `src/config.ts`:
- `website` / `author` / `title` / `desc`
- `postPerPage` — Posts per page (default: 4)
- `lightAndDarkMode` — Toggle theme
- `editPost` — GitHub edit link

## Customization

- **Anime**: `pnpm anime:sync` syncs from AniList. GitHub Actions runs weekly.
- **Friends**: Edit `src/data/friends.ts`.
- **i18n**: UI strings in `src/i18n.ts`. English routes under `/en/`.
- **Posts**: Markdown in `src/data/blog/`. Required frontmatter: `title`, `pubDatetime`, `description`, `tags`.

## License

MIT

---

Built on [AstroPaper](https://github.com/satnaing/astro-paper), maintained by [miuo](https://blog.miuo.me/).
