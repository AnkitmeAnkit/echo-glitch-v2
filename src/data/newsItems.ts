export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
}

export const newsCategories = [
  'All News',
  'Product Updates',
  'Industry',
  'Announcements',
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export const categoryColors: Record<string, string> = {
  'Product Update': 'bg-accent-violet text-white',
  'Industry': 'bg-accent-teal text-white',
  'Announcement': 'bg-accent-amber text-white',
  'Partnership': 'bg-accent-rose text-white',
};

export const newsItems: NewsItem[] = [];
