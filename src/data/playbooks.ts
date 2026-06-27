export interface Playbook {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  author: string;
  tags: string[];
  isNew?: boolean;
}

export const categories = [
  'All',
  'AI Automation',
  'Prompt Engineering',
  'Workflow',
  'Business',
  'Creative',
] as const;

export type Category = (typeof categories)[number];

export const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
] as const;

export type SortOption = (typeof sortOptions)[number]['value'];

export const playbooks: Playbook[] = [];

export function getRelatedPlaybooks(currentId: number, count: number = 3): Playbook[] {
  const current = playbooks.find((p) => p.id === currentId);
  if (!current) return playbooks.slice(0, count);
  return playbooks
    .filter((p) => p.id !== currentId && p.category === current.category)
    .slice(0, count);
}

export function getPlaybookById(id: number): Playbook | undefined {
  return playbooks.find((p) => p.id === id);
}
