export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; label: string }
> = {
  zh: { htmlLang: "zh-CN", ogLocale: "zh_CN", label: "中文" },
  en: { htmlLang: "en", ogLocale: "en_US", label: "English" },
};

export const ui = {
  zh: {
    site: {
      desc: "记录文章、笔记、实验和暂时不想丢掉的内容。",
    },
    nav: {
      home: "首页",
      archives: "归档",
      anime: "追番",
      tools: "工具",
      friends: "友链",
      about: "关于",
      search: "搜索",
      skipToContent: "跳到正文",
      theme: "切换浅色/深色模式",
      themeToDark: "深色",
      themeToLight: "浅色",
      mail: "邮件",
      email: "发送邮件",
      rss: "RSS 订阅",
      login: "登录",
      menu: "导航菜单",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    pages: {
      postsTitle: "文章",
      homeFullTitle: "技术笔记与个人博客",
      loadMore: "加载更多",
      listStatus: "已显示 {shown} / {total} 篇",
      homeDesc:
        "miuarc 的个人技术博客，分享 VPS 运维、自托管服务搭建、开发工具配置与个人工作流优化等领域的原创笔记与详细教程。",
      postsDesc:
        "这里是我发布过的所有技术文章，涵盖 VPS 运维记录、自托管服务部署教程、开发工具配置指南以及个人工作流优化经验。",
      tagsTitle: "标签",
      tagsDesc:
        "按标签分类浏览所有技术文章，快速定位 VPS、自托管、开发工具等感兴趣的主题与教程。",
      tagTitle: "标签：",
      tagDescPrefix: "所有带有“",
      tagDescSuffix: "”标签的文章。",
      archivesTitle: "归档",
      archivesEyebrow: "Archive",
      archivesDesc:
        "按时间线浏览 miuarc 博客的全部已发布文章，按年份和月份整理，方便回溯历史技术笔记。",
      searchTitle: "搜索",
      searchDesc: "站内技术文章、笔记和教程，输入关键词即可快速定位。",
      animeTitle: "追番列表",
      animeFullTitle: "追番列表 | miuarc",
      animeDesc: "可按年份或全部查看 AniList normal 列表中已看完的动画。",
      animeEyebrow: "Anime Archive",
      toolsTitle: "工具",
      toolsFullTitle: "工具 | miuarc",
      toolsDesc: "一些实验性项目和小玩意儿。",
      friendsTitle: "友链",
      friendsDesc:
        "miuarc 的友情链接页面，收录了多个优质个人独立博客，欢迎通过评论区或邮件提交申请交换友链。",
      friendsEyebrow: "Link Exchange",
      aboutTitle: "关于",
      aboutEyebrow: "About",
      aboutDesc:
        "了解 miuarc 的个人简介、自托管服务列表（听歌记录、壁纸站、临时邮箱等）以及联系方式。",
      notFoundTitle: "页面未找到",
      notFoundCta: "返回首页",
      notFoundDesc:
        "您访问的页面不存在，可能已被移除或链接错误。返回 miuarc 博客首页浏览更多技术文章。",
    },
    actions: {
      goBack: "返回",
      backToTop: "回到顶部",
      editPage: "编辑页面",
      comments: "评论",
      previousPost: "上一篇",
      nextPost: "下一篇",
      copy: "复制",
      copied: "已复制",
      copyPostLink: "复制文章链接",
      postLinkCopied: "链接已复制",
      updated: "更新：",
      previousPage: "上一页",
      nextPage: "下一页",
      previousPageLabel: "前往上一页",
      nextPageLabel: "前往下一页",
      tocTitle: "文章目录",
      tocToggle: "打开文章目录",
      tocClose: "关闭文章目录",
      commentPlaceholder: "写点什么吧...",
      noComment: "「快来做第一个留言的人吧」",
      commentCount: "{count} 条留言",
      licenseNote: "本文采用",
      licenseNoteSuffix: "许可协议，转载请注明出处。",
    },
    anime: {
      unknownYear: "未标年份",
      countUnit: "部",
      total: "总计",
      dataFrom: "数据来自",
      updatedAt: "更新于",
      viewMode: "展示",
      viewAll: "全部",
      viewByYear: "按年份",
      empty: "这里还没有同步到追番数据。",
      emptyHelp:
        "运行脚本会抓取 miuchanya 的 AniList 数据，并保留 normal 列表里状态为 COMPLETED 的动画。",
      itemListName: "追番列表",
      coverAlt: "封面",
      backToTop: "回到顶部",
    },
    dev: {
      searchWarning:
        "开发模式提示：需要至少构建一次项目，才能在开发环境里看到搜索结果。",
    },
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  en: {
    site: {
      desc: "Notes on self-hosting, VPS operations, developer tooling and personal workflows.",
    },
    nav: {
      home: "Home",
      archives: "Archives",
      anime: "Anime",
      tools: "Tools",
      friends: "Friends",
      about: "About",
      search: "Search",
      skipToContent: "Skip to content",
      theme: "Toggle light/dark mode",
      themeToDark: "Dark",
      themeToLight: "Light",
      mail: "Email",
      email: "Send email",
      rss: "RSS feed",
      login: "Log in",
      menu: "Navigation menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    pages: {
      postsTitle: "Posts",
      homeFullTitle: "Notes & Blog",
      loadMore: "Load more",
      listStatus: "Showing {shown} of {total} posts",
      homeDesc:
        "miuarc's personal tech blog: notes and tutorials on VPS operations, self-hosted services, developer tooling and personal workflows.",
      postsDesc:
        "Every post published on this blog, covering VPS operations, self-hosting tutorials, developer tooling and workflow optimization.",
      tagsTitle: "Tags",
      tagsDesc: "Browse posts by tag.",
      tagTitle: "Tag: ",
      tagDescPrefix: "All posts tagged “",
      tagDescSuffix: "”.",
      archivesTitle: "Archives",
      archivesEyebrow: "Archive",
      archivesDesc: "Browse every published post by year and month.",
      searchTitle: "Search",
      searchDesc: "Search posts, notes and tutorials on this site.",
      animeTitle: "Anime list",
      animeFullTitle: "Anime list | miuarc",
      animeDesc: "Anime completed on the AniList normal list, by year or all.",
      animeEyebrow: "Anime Archive",
      toolsTitle: "Tools",
      toolsFullTitle: "Tools | miuarc",
      toolsDesc: "Experimental projects and small toys.",
      friendsTitle: "Friends",
      friendsDesc:
        "Friend links: a collection of personal blogs I follow. Feel free to get in touch if you would like to exchange links.",
      friendsEyebrow: "Link Exchange",
      aboutTitle: "About",
      aboutEyebrow: "About",
      aboutDesc:
        "About miuarc: background, self-hosted services and contact details.",
      notFoundTitle: "Page not found",
      notFoundCta: "Back to home",
      notFoundDesc:
        "This page does not exist. It may have been removed or the link is wrong.",
    },
    actions: {
      goBack: "Back",
      backToTop: "Back to top",
      editPage: "Edit page",
      comments: "Comments",
      previousPost: "Previous",
      nextPost: "Next",
      copy: "Copy",
      copied: "Copied",
      copyPostLink: "Copy post link",
      postLinkCopied: "Link copied",
      updated: "Updated: ",
      previousPage: "Previous",
      nextPage: "Next",
      previousPageLabel: "Go to previous page",
      nextPageLabel: "Go to next page",
      tocTitle: "Table of contents",
      tocToggle: "Open table of contents",
      tocClose: "Close table of contents",
      commentPlaceholder: "Write something...",
      noComment: "Be the first to leave a comment.",
      commentCount: "{count} comments",
      licenseNote: "Licensed under",
      licenseNoteSuffix: ". Please credit the source when reposting.",
    },
    anime: {
      unknownYear: "Year unknown",
      countUnit: "shows",
      total: "Total",
      dataFrom: "Data from",
      updatedAt: "Updated",
      viewMode: "View",
      viewAll: "All",
      viewByYear: "By year",
      empty: "No anime data synced yet.",
      emptyHelp:
        "Run the sync script to fetch AniList data and keep completed shows from the normal list.",
      itemListName: "Anime list",
      coverAlt: "cover",
      backToTop: "Back to top",
    },
    dev: {
      searchWarning:
        "Dev mode: build the project at least once to see search results in development.",
    },
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
} as const;

export function getLocaleFromPath(pathname: string): Locale {
  const path = normalizePath(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : defaultLocale;
}

export function normalizePath(pathname: string) {
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
}

export function localizePath(pathname: string, locale: Locale = defaultLocale) {
  const path = normalizePath(pathname);

  if (locale === defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path;

  return `/${locale}${path}`;
}

export function getDateLocale(locale: Locale = defaultLocale) {
  return localeMeta[locale].htmlLang;
}

/** 生成与 canonical 一致的绝对地址（静态输出带尾斜杠） */
export function toAbsoluteUrl(pathname: string, base: URL) {
  const path = normalizePath(pathname);
  return new URL(path === "/" ? "/" : `${path}/`, base).href;
}
