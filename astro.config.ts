import { defineConfig } from "astro/config";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
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

const distDir = fileURLToPath(new URL("./dist/", import.meta.url));

/** 把 URL 路径映射到另一种语言的同一页面（/posts/x/ ⇄ /en/posts/x/） */
function counterpartPath(pathname: string, target: "zh" | "en") {
  const isEn = pathname === "/en/" || pathname.startsWith("/en/");
  // 去掉 /en 前缀后要留空而不是补 "/"，否则 /en/about/ 会变成 //about/
  const zhPath = isEn ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
  if (target === "zh") return zhPath;
  return isEn ? pathname : zhPath === "/" ? "/en/" : `/en${zhPath}`;
}

/** 构建产物里是否真的生成了这一页（serialize 在 build:done 阶段跑，dist 已写完） */
function builtPageExists(pathname: string) {
  const segments = decodeURIComponent(pathname).split("/").filter(Boolean);
  return existsSync(join(distDir, ...segments, "index.html"));
}

/**
 * 给 sitemap 条目补 hreflang。
 * @astrojs/sitemap 自带的 i18n 选项会把每个 URL 机械映射到所有语言，
 * 但标签、归档、搜索、友链、工具这些中文页并没有英文版，那样会写出一堆
 * 指向 404 的 alternate。这里按构建产物实际存在的页面配对，只配对成功才写。
 */
function buildAlternateLinks(url: string) {
  const { origin, pathname } = new URL(url);
  const zhPath = counterpartPath(pathname, "zh");
  const enPath = counterpartPath(pathname, "en");
  if (!builtPageExists(zhPath) || !builtPageExists(enPath)) return undefined;

  const zhUrl = new URL(zhPath, origin).href;
  return [
    { lang: "zh-CN", url: zhUrl },
    { lang: "en", url: new URL(enPath, origin).href },
    { lang: "x-default", url: zhUrl },
  ];
}

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
      serialize(item) {
        const links = buildAlternateLinks(item.url);
        if (links) item.links = links;
        return item;
      },
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
