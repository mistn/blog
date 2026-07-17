# miuo's blog

基于 [Astro](https://astro.build/) v5 + [Tailwind CSS](https://tailwindcss.com/) v4 的个人技术博客。

## 功能

- 中英双语（`/en/` 路径前缀）
- UptimeRobot 监控面板 + 自托管服务入口（`/tools`）
- AniList 追番自动同步
- Pagefind 离线搜索、KaTeX 公式、Shiki 代码高亮
- 深浅色模式、响应式、RSS、Sitemap

## 本地运行

```bash
pnpm install
pnpm dev
pnpm build
```

## Vercel 部署

导入仓库即可。需添加环境变量：

| 变量 | 说明 |
|------|------|
| `UPROBOT_API_KEY` | UptimeRobot 只读 API Key（[获取](https://dashboard.uptimerobot.com/integrations)） |

`/api/monitors` 为服务端缓存端点，`vercel.json` 含每 6 小时自动刷新定时任务。

## License

MIT
