import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config.ts";

export type FriendLink = {
  name: string;
  blog?: string;
  href: string;
  avatar?: string;
  description: string;
  color?: string;
  email?: string;
};

export const defaultFriendAvatar = "/friend-default-avatar.avif";

export const siteProfile = {
  name: "miuarc",
  href: "https://miuarc.com/",
  description: "Notes, essays, experiments, and the bits worth keeping around.",
  avatar: "https://miuarc.com/avatar.avif",
};

export async function getFriendLinks(): Promise<FriendLink[]> {
  const reader = createReader(process.cwd(), keystaticConfig);
  const data = await reader.singletons.friends.read();

  // keystatic reader 对缺失的可选字段返回空字符串 ""，而非 undefined，
  // 会导致模板中 `blog ?? name` 等回退逻辑失效，这里统一归一化
  const orUndefined = (value: string | undefined | null) =>
    value === undefined || value === null || value === "" ? undefined : value;

  return (data?.items ?? [])
    .map(item => ({
      name: item.name,
      blog: orUndefined(item.blog),
      href: item.href,
      avatar: orUndefined(item.avatar),
      description: item.description,
      color: orUndefined(item.color),
      email: orUndefined(item.email),
    }))
    .filter(item => item.name && item.href);
}