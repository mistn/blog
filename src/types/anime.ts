export interface AnimeItem {
  /** AniList 的 native 标题（多数是日文原名），中文站直接用这个 */
  title: string;
  /** romaji 标题，英文站优先用它；老数据可能没有 */
  titleRomaji?: string | null;
  cover: string;
  year: number | null;
  url: string;
}

export interface AnimeDataPayload {
  username: string | null;
  updatedAt: string | null;
  items: AnimeItem[];
}
