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
  name: "miuo",
  href: "https://miuo.me/",
  description: "Notes, essays, experiments, and the bits worth keeping around.",
  avatar: "https://miuo.me/avatar.avif",
};

export const friendLinks: FriendLink[] = [
  {
    name: "krau",
    blog: "krau's blog",
    href: "https://krau.top",
    avatar: "https://krau.top/photo/avatar/avatar.jpg",
    description: "子供の时の梦は言えますか",
    color: "#39c5bb",
  },
  {
    name: "关于IFDESS的书",
    href: "https://111654.xyz/",
    avatar: "https://static.ifdess.cn/img/avatar.jpg",
    description: "这是一本记录IFDESS的经历和感悟的书。",
  },
  {
    name: "huizhi's Aside",
    href: "https://blog.huizhi.ink/",
    description: "也许只是些碎碎念吧。",
    color: "#0b84c6",
  },
  {
    name: "Karlbaey",
    blog: "卡尔白的纸箱📦",
    href: "https://re.karlbaey.top",
    avatar: "https://avatars.githubusercontent.com/u/191684279",
    description: "这里存着卡尔白的过去、现在和未来",
  },
  {
    name: "番茄主理人",
    href: "https://fqzlr.com/",
    avatar: "https://q1.qlogo.cn/g?b=qq&nk=20447289&s=640",
    description: "坐而言不如起而行.",
  },
  {
    name: "wutong-yu-blog",
    href: "https://wutongyu.site",
    avatar: "https://wutongyu.site/cat-icon.svg",
    description: "全栈&Agent 开发和我的随想",
  },
  {
    name: "灵的梦境",
    href: "https://lemonadorable.github.io/",
    avatar: "https://lemonadorable.github.io/favicon/favicon.gif",
    description: "愿美梦成真",
  },
  {
    name: "Seeridia's Home",
    href: "https://blog.seeridia.top",
    avatar: "https://www.github.com/Seeridia.png",
    description: "Seeridia 的小小小的大窝！",
  },
  {
    name: "夜轻Blog",
    href: "https://blog.yeqing.net/",
    avatar: "https://list.yppp.net/d/cos/yeqing.webp",
    description: "一个人",
  },
  {
    name: "顾拾柒",
    blog: "Olinl Blog",
    href: "https://blog.olinl.com/",
    avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=9892214&spec=0",
    description: "分享、实践、学习",
  },
  {
    name: "胡杨怕火",
    href: "https://funingna-wakawaka.github.io/",
    avatar: "https://funingna-wakawaka.github.io/images/0.png",
    description: "传递笑容魔法的Ciallo～(∠・ω< )⌒☆",
  },
];
