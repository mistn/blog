import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
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
  session: false,
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMath,
        remarkDirective,
        remarkTabsPlugin,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
        remarkAlert,
      ],
      rehypePlugins: [rehypeKatex, rehypeWrapTables, rehypeLazyImages],
    }),
  },
  integrations: [
    expressiveCode(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    mdx(),
    react(),
  ],
  vite: {
    envPrefix: ["PUBLIC_", "VITE_"],
    server: {
      // 不要监听构建产物与本地工具缓存目录。
      // 这些目录里动辄上万个文件（如浏览器 profile），被 chokidar 持续监听会
      // 让 dev server 空转吃满 CPU、内存涨到 GB 级，表现为预览页面明显卡顿。
      watch: {
        ignored: ["**/.workbuddy-ai/**", "**/dist/**"],
      },
    },
    resolve: {
      // 强制所有模块使用同一个 React 实例，解决 React 内部实例冲突
      dedupe: ["react", "react-dom"],
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
});
