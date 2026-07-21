import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
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
  // Vercel adapter —— 部署到 Vercel 时自动检测
  // 如果改用 Cloudflare Pages 可以移除
  adapter: vercel(),
  integrations: [
    expressiveCode(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    mdx(),
    react(),
    keystatic(),
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
    // Keystatic 在 SSR bundle 中用 import.meta.env 读取这些变量，
    // 但 Vite 不会自动内联未加前缀的自定义变量。用 define 强制替换。
    define: {
      "import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID": JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_ID),
      "import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET": JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
      "import.meta.env.KEYSTATIC_SECRET": JSON.stringify(process.env.KEYSTATIC_SECRET),
    },
    resolve: {
      // 强制所有模块使用同一个 React 实例，解决 Keystatic 内部 React 实例冲突
      dedupe: ["react", "react-dom"],
    },
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      // 强制预打包 React 和 Yjs，确保 Keystatic 和项目共用同一个实例
      include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
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
