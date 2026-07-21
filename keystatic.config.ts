import { config, collection, fields } from "@keystatic/core";

export default config({
  // 开发环境用本地文件系统，生产环境走 GitHub OAuth
  // 生产部署需要在 Vercel 设置 KEYSTATIC_GITHUB_CLIENT_ID / KEYSTATIC_GITHUB_CLIENT_SECRET
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : { kind: "github", repo: "mistn/blog" as const },

  collections: {
    // 博客文章集合
    blog: collection({
      label: "博客文章",
      slugField: "title",
      path: "src/data/blog/*",
      // YAML frontmatter + markdown body，content 字段作为正文
      format: { data: "yaml", contentField: "content" },
      schema: {
        // slug 字段存储为 { name, slug }，在 content.config.ts 中通过 transform 转回字符串
        title: fields.slug({ name: { label: "标题" } }),
        pubDatetime: fields.date({
          label: "发布日期",
          validation: { isRequired: true },
        }),
        modDatetime: fields.date({ label: "修改日期" }),
        description: fields.text({
          label: "描述",
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: "标签" }), {
          label: "标签",
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({ label: "草稿" }),
        featured: fields.checkbox({ label: "精选" }),
        // 正文内容（markdown body）
        content: fields.mdx({
          label: "正文",
          extension: "md",
        }),
      },
    }),

    // 周刊集合
    weekly: collection({
      label: "周刊",
      slugField: "title",
      path: "src/data/weekly/*",
      // YAML frontmatter + markdown body，content 字段作为正文
      format: { data: "yaml", contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "标题" } }),
        pubDatetime: fields.date({
          label: "发布日期",
          validation: { isRequired: true },
        }),
        issueNumber: fields.integer({ label: "期号" }),
        description: fields.text({
          label: "描述",
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: "标签" }), {
          label: "标签",
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({ label: "草稿" }),
        // 正文内容（markdown body）
        content: fields.mdx({
          label: "正文",
          extension: "md",
        }),
      },
    }),
  },
});
