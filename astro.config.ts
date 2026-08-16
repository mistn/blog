import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import cloudflare from "@astrojs/cloudflare";
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

// 双平台构建：默认（无 ADAPTER 变量）= Vercel，与历史行为完全一致；
// Cloudflare Pages 构建时设置 ADAPTER=cloudflare（或由 CF_PAGES=1 自动识别）。
const target = process.env.ADAPTER ?? (process.env.CF_PAGES === "1" ? "cloudflare" : "vercel");
// prerenderEnvironment: "node" —— OG 图片等在构建期用原生 resvg 生成，
// workerd 无法加载原生 .node 二进制，故静态页面用 Node 环境预渲染
// session:false 关闭 Astro sessions，避免自动声明 SESSION KV 绑定；
// imageService:"compile" 用 Sharp 在构建期完成图片优化，避免自动声明 IMAGES 绑定
// （本站 output:"static"，全部产物在构建期生成，运行时无需图片变换）
const adapter = target === "cloudflare"
  ? cloudflare({ prerenderEnvironment: "node", imageService: "compile" })
  : vercel();

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  session: false,
  build: {
    inlineStylesheets: "always",
  },
  adapter,
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
    keystatic(),
  ],
  vite: {
    // Keystatic 需要 import.meta.env.KEYSTATIC_* 变量；
    // ADMIN_/UPROBOT_/GITHUB_ 供 Cloudflare Pages 运行时经 import.meta.env 读取
    envPrefix: ["PUBLIC_", "VITE_", "KEYSTATIC_", "ADMIN_", "UPROBOT_", "GITHUB_"],
    resolve: {
      // 强制所有模块使用同一个 React 实例，解决 Keystatic 内部 React 实例冲突
      dedupe: ["react", "react-dom"],
    },
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
});
