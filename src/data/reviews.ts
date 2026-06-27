export interface Review {
  id: number;
  playbookId: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
}

const avatarPool = [
  '/avatar-1.jpg',
  '/avatar-2.jpg',
  '/avatar-3.jpg',
  '/avatar-4.jpg',
  '/avatar-5.jpg',
  '/avatar-6.jpg',
];

const reviewerNames = [
  'Alex M.',
  'Jamie K.',
  'Ravi S.',
  'Sofia L.',
  'Marcus T.',
  'Emily R.',
  'Jordan P.',
  'Nina W.',
  'David C.',
  'Lisa H.',
  'Tom B.',
  'Anna S.',
];

const reviewTexts = [
  'This playbook paid for itself in the first hour. The automation section alone is worth the price.',
  'Clear, concise, and immediately actionable. No filler — just pure value from start to finish.',
  'Great content. Would love an update for GPT-5 when it drops. Highly recommended overall.',
  'Finally, a resource that actually delivers on its promises. My workflow has never been smoother.',
  'The prompt templates are incredibly well-crafted. I have been using them daily for two months.',
  'Solid playbook with practical examples. The step-by-step format makes it easy to follow along.',
  'Transformed how I approach AI tools. The frameworks in here are genuinely game-changing.',
  'Well-structured, thoroughly researched, and beautifully presented. Worth every penny.',
  'I was skeptical at first, but this exceeded all expectations. My productivity has doubled.',
  'The real-world examples section is gold. It helped me understand the concepts so much better.',
  'Excellent resource for beginners and pros alike. I reference it weekly in my work.',
  'This is the playbook I wish I had when I started. Incredibly comprehensive and well-written.',
];

function generateReviews(playbookId: number): Review[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: playbookId * 100 + i,
    playbookId,
    name: reviewerNames[(playbookId + i) % reviewerNames.length],
    avatar: avatarPool[(playbookId + i) % avatarPool.length],
    rating: 4 + (i % 2),
    date: ['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '2 months ago'][i],
    text: reviewTexts[(playbookId + i) % reviewTexts.length],
    helpful: Math.floor(Math.random() * 24) + 1,
  }));
}

const reviewsMap = new Map<number, Review[]>();

export function getReviewsByPlaybookId(playbookId: number): Review[] {
  if (!reviewsMap.has(playbookId)) {
    reviewsMap.set(playbookId, generateReviews(playbookId));
  }
  return reviewsMap.get(playbookId)!;
}
