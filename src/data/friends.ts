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

  return (data?.items ?? [])
    .map(item => ({
      name: item.name,
      blog: item.blog ?? undefined,
      href: item.href,
      avatar: item.avatar ?? undefined,
      description: item.description,
      color: item.color ?? undefined,
      email: item.email ?? undefined,
    }))
    .filter(item => item.name && item.href);
}