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

export const playbooks: Playbook[] = [
  {
    id: 1,
    title: 'ChatGPT Mastery Blueprint',
    description: 'Unlock the full potential of ChatGPT with advanced prompting techniques, system prompts, and automation workflows.',
    category: 'Prompt Engineering',
    price: 0,
    rating: 4.8,
    reviewCount: 127,
    coverImage: '/playbook-cover-1.jpg',
    author: 'Alex Chen',
    tags: ['ChatGPT', 'GPT-4', 'Automation'],
  },
  {
    id: 2,
    title: 'Midjourney Visual Systems',
    description: 'Create stunning AI-generated artwork with structured prompt frameworks, style references, and batch workflows.',
    category: 'Creative',
    price: 29,
    rating: 4.9,
    reviewCount: 84,
    coverImage: '/playbook-cover-2.jpg',
    author: 'Sofia Martinez',
    tags: ['Midjourney', 'DALL-E', 'Design'],
  },
  {
    id: 3,
    title: 'AI Sales Automation Engine',
    description: 'Build end-to-end sales pipelines using AI outreach, lead scoring, and automated follow-up sequences.',
    category: 'AI Automation',
    price: 49,
    rating: 4.7,
    reviewCount: 203,
    coverImage: '/playbook-cover-3.jpg',
    author: 'Marcus Johnson',
    tags: ['Sales', 'CRM', 'Zapier'],
    isNew: true,
  },
  {
    id: 4,
    title: 'No-Code AI Workflows',
    description: 'Connect AI tools with no-code platforms to build powerful automations without writing a single line of code.',
    category: 'Workflow',
    price: 0,
    rating: 4.6,
    reviewCount: 156,
    coverImage: '/playbook-cover-4.jpg',
    author: 'Emily Park',
    tags: ['No-Code', 'Make', 'Zapier'],
  },
  {
    id: 5,
    title: 'Content Creation Flywheel',
    description: 'Systematize your content production with AI-assisted research, drafting, editing, and distribution workflows.',
    category: 'Business',
    price: 39,
    rating: 4.8,
    reviewCount: 91,
    coverImage: '/playbook-cover-5.jpg',
    author: 'Jordan Blake',
    tags: ['Content', 'SEO', 'Marketing'],
  },
  {
    id: 6,
    title: 'Claude Code Assistant',
    description: 'Leverage Claude for software development, code review, debugging, and technical documentation automation.',
    category: 'AI Automation',
    price: 0,
    rating: 4.5,
    reviewCount: 72,
    coverImage: '/playbook-cover-6.jpg',
    author: 'Ravi Sharma',
    tags: ['Claude', 'Coding', 'DevOps'],
  },
  {
    id: 7,
    title: 'Data Analysis with AI',
    description: 'Transform raw data into actionable insights using AI-powered analysis, visualization, and reporting tools.',
    category: 'Business',
    price: 59,
    rating: 4.9,
    reviewCount: 48,
    coverImage: '/playbook-cover-1.jpg',
    author: 'Lisa Wong',
    tags: ['Data', 'Python', 'Excel'],
    isNew: true,
  },
  {
    id: 8,
    title: 'Social Media Growth System',
    description: 'Automate your social presence with AI-generated content calendars, engagement tools, and analytics dashboards.',
    category: 'Business',
    price: 34,
    rating: 4.6,
    reviewCount: 118,
    coverImage: '/playbook-cover-2.jpg',
    author: 'Tom Bradley',
    tags: ['Social', 'Instagram', 'Twitter'],
  },
  {
    id: 9,
    title: 'AI Email Sequences That Convert',
    description: 'Craft high-converting email campaigns with personalized AI copy, A/B testing frameworks, and drip sequences.',
    category: 'AI Automation',
    price: 0,
    rating: 4.7,
    reviewCount: 165,
    coverImage: '/playbook-cover-3.jpg',
    author: 'Nina Patel',
    tags: ['Email', 'Copywriting', 'ConvertKit'],
  },
  {
    id: 10,
    title: 'Prompt Engineering for Developers',
    description: 'Master advanced prompting patterns for API integration, function calling, and building AI-powered applications.',
    category: 'Prompt Engineering',
    price: 49,
    rating: 4.8,
    reviewCount: 94,
    coverImage: '/playbook-cover-4.jpg',
    author: 'David Kim',
    tags: ['API', 'OpenAI', 'Development'],
  },
  {
    id: 11,
    title: 'AI-Powered Customer Support',
    description: 'Deploy intelligent support bots, ticket routing, and knowledge base automation for 24/7 customer care.',
    category: 'Workflow',
    price: 44,
    rating: 4.5,
    reviewCount: 67,
    coverImage: '/playbook-cover-5.jpg',
    author: 'Anna Schmidt',
    tags: ['Support', 'Intercom', 'Chatbot'],
  },
  {
    id: 12,
    title: 'Creative Writing with AI',
    description: 'Enhance your storytelling with AI co-writing, character development, world-building, and editing assistance.',
    category: 'Creative',
    price: 0,
    rating: 4.7,
    reviewCount: 133,
    coverImage: '/playbook-cover-6.jpg',
    author: 'Maya Thompson',
    tags: ['Writing', 'Fiction', 'Editing'],
  },
];

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
