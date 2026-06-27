export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const categories = [
  'All',
  'Tutorials',
  'Editorial',
  'Case Studies',
  'AI News',
  'Prompt Engineering',
  'Automation',
] as const;

export type Category = (typeof categories)[number];

export const blogPosts: BlogPost[] = [];
