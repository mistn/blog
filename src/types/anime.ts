export interface AnimeEntry {
  id: number;
  listId: number;
  title: string;
  titleNative: string | null;
  titleEnglish: string | null;
  coverImage: string | null;
  coverColor: string | null;
  bannerImage: string | null;
  siteUrl: string;
  status: string | null;
  progress: number;
  episodes: number | null;
  score: number | null;
  year: number | null;
  season: string | null;
  format: string | null;
  studios: string[];
  updatedAt: string | null;
}

export interface AnimeYearGroup {
  year: number | null;
  yearLabel: string;
  entries: AnimeEntry[];
}

export interface AnimeCollectionData {
  generatedAt: string | null;
  source: {
    name: string;
    url: string;
    userName: string | null;
    userId: number | null;
    userUrl: string | null;
    statuses: string[];
    customListName: string;
  };
  total: number;
  groups: AnimeYearGroup[];
}
