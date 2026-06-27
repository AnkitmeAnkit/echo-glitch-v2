export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'PLAYBOOK' | 'BLOG' | 'NEWS';
  description?: string;
  created_at: string;
}

export interface AdminPlaybook {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  cover_image_url?: string;
  file_path?: string;
  is_featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Relations mapped
  categories?: { name: string; slug: string };
  playbook_reviews?: { rating: number; review_text: string; is_approved: boolean }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author_id?: string;
  category_id?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Relations mapped
  categories?: { name: string; slug: string };
  users?: { full_name: string; avatar_url: string };
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  timeline_date: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Relations mapped
  categories?: { name: string; slug: string };
  users?: { full_name: string; avatar_url: string };
}

export interface Purchase {
  id: string;
  playbook_id?: string;
  full_name: string;
  email: string;
  phone: string;
  profession: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  created_at: string;
  
  // Custom joined relations
  playbooks?: { title: string };
}

export interface FeedbackEntry {
  id: string;
  type: 'FEEDBACK' | 'CUSTOM_REQUEST';
  name: string;
  email: string;
  message_or_requirements: string;
  budget_range?: string;
  status: 'NEW' | 'REVIEWED' | 'RESOLVED';
  created_at: string;
}

export interface CustomRequest extends FeedbackEntry {}

export interface Review {
  id: string;
  playbook_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  
  // Relations mapped
  playbooks?: { title: string };
  users?: { full_name: string; avatar_url: string };
}

export interface DailyStat {
  date: string;
  purchases: number;
  downloads: number;
  revenue: number;
  visits: number;
}
