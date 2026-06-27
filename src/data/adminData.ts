export interface Purchase {
  id: string;
  playbookId: number;
  playbookTitle: string;
  customerName: string;
  email: string;
  phone: string;
  profession: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending';
}

export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  category: 'Suggestion' | 'Bug Report' | 'Feature Request' | 'General';
  message: string;
  date: string;
  status: 'New' | 'In Progress' | 'Resolved';
}

export interface CustomRequest {
  id: string;
  name: string;
  email: string;
  topic: string;
  details: string;
  budget?: string;
  date: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Declined';
}

export interface DailyStat {
  date: string;
  purchases: number;
  downloads: number;
  revenue: number;
  visits: number;
}

export interface Review {
  id: string;
  playbookId: number;
  playbookTitle: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface AdminPlaybook {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  status: 'Published' | 'Draft';
  downloads: number;
  coverImage: string;
  fileUrl: string;
  rating: number;
  reviewCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
  featured: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  category: 'Product Update' | 'Industry' | 'Announcement';
  author: string;
  excerpt: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
  featured: boolean;
}

export const mockPurchases: Purchase[] = [];

export const mockFeedback: FeedbackEntry[] = [];

export const mockCustomRequests: CustomRequest[] = [];

export const generateDailyStats = (): DailyStat[] => {
  return [];
};

export const mockDailyStats: DailyStat[] = [];

export const mockReviews: Review[] = [];

export const mockAdminPlaybooks: AdminPlaybook[] = [];

export const mockBlogPosts: BlogPost[] = [];

export const mockNewsPosts: NewsPost[] = [];

export const analyticsSummary = {
  totalPlaybooks: 0,
  totalPurchases: 0,
  totalDownloads: 0,
  totalRevenue: 0,
  activeUsers: 0,
  freeDownloads: 0,
  paidDownloads: 0,
};

export const trafficSources: any[] = [];

export const playbooksByCategory: any[] = [];

export const freeVsPaid: any[] = [];
