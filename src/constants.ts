import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconHome from "@/assets/icons/IconHome.svg";
import IconArchive from "@/assets/icons/IconArchive.svg";
import IconPlay from "@/assets/icons/IconPlay.svg";
import IconHeart from "@/assets/icons/IconHeart.svg";
import IconTool from "@/assets/icons/IconTool.svg";
import IconUser from "@/assets/icons/IconUser.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "Mail",
    href: "mailto:miu@miuarc.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export type NavLabelKey =
  | "home"
  | "archives"
  | "anime"
  | "friends"
  | "tools"
  | "about";

export interface NavItem {
  /** 路由路径，实际渲染时会走 localizePath */
  path: string;
  /** 对应 i18n 里 nav 下的文案键名 */
  labelKey: NavLabelKey;
  /** 移动端抽屉使用的图标，桌面标签不渲染图标 */
  icon: (_props: Props) => Element;
  /** 为 true 时不在导航中渲染（如关闭归档入口） */
  hidden?: boolean;
}

/**
 * 站点主导航的唯一数据源。
 * 桌面标签栏（HomeTabs）与移动端抽屉都从这里渲染，新增栏目只需改这一处。
 */
export const NAV_ITEMS: NavItem[] = [
  { path: "/", labelKey: "home", icon: IconHome },
  {
    path: "/archives",
    labelKey: "archives",
    icon: IconArchive,
    hidden: !SITE.showArchives,
  },
  { path: "/anime", labelKey: "anime", icon: IconPlay },
  { path: "/friends", labelKey: "friends", icon: IconHeart },
  { path: "/tools", labelKey: "tools", icon: IconTool },
  { path: "/about", labelKey: "about", icon: IconUser },
];

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
