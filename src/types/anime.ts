export interface AnimeItem {
  title: string;
  cover: string;
  coverSmall?: string | null;
  year: number | null;
  url: string;
}

export interface AnimeDataPayload {
  username: string | null;
  updatedAt: string | null;
  items: AnimeItem[];
}
