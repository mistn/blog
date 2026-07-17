import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { rehypeWrapTables } from "./src/utils/rehypeWrapTables.js";
import { rehypeLazyImages } from "./src/utils/rehypeLazyImages.js";
import { remarkAlert } from "remark-github-blockquote-alert";
import { remarkTabsPlugin } from "./src/utils/remarkTabsPlugin.js";
import remarkDirective from "remark-directive";
import expressiveCode from "astro-expressive-code";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  // Vercel adapter - auto-detected when deployed to Vercel
  // Can be removed if using Cloudflare Pages instead
  adapter: vercel(),
  integrations: [
    expressiveCode(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkTabsPlugin,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
      remarkAlert,
    ],
    rehypePlugins: [rehypeKatex, rehypeWrapTables, rehypeLazyImages],
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
