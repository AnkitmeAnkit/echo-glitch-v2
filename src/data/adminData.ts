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

export const mockPurchases: Purchase[] = [
  { id: 'p1', playbookId: 2, playbookTitle: 'Midjourney Visual Systems', customerName: 'Alice Johnson', email: 'alice@example.com', phone: '+1-234-567-8901', profession: 'Designer', amount: 29, date: '2024-01-15', status: 'Completed' },
  { id: 'p2', playbookId: 3, playbookTitle: 'AI Sales Automation Engine', customerName: 'Bob Williams', email: 'bob@example.com', phone: '+1-234-567-8902', profession: 'Sales Manager', amount: 49, date: '2024-01-14', status: 'Completed' },
  { id: 'p3', playbookId: 5, playbookTitle: 'Content Creation Flywheel', customerName: 'Carol Davis', email: 'carol@example.com', phone: '+1-234-567-8903', profession: 'Content Creator', amount: 39, date: '2024-01-14', status: 'Pending' },
  { id: 'p4', playbookId: 7, playbookTitle: 'Data Analysis with AI', customerName: 'Dan Miller', email: 'dan@example.com', phone: '+1-234-567-8904', profession: 'Data Analyst', amount: 59, date: '2024-01-13', status: 'Completed' },
  { id: 'p5', playbookId: 8, playbookTitle: 'Social Media Growth System', customerName: 'Eva Wilson', email: 'eva@example.com', phone: '+1-234-567-8905', profession: 'Marketing Lead', amount: 34, date: '2024-01-13', status: 'Completed' },
  { id: 'p6', playbookId: 10, playbookTitle: 'Prompt Engineering for Developers', customerName: 'Frank Moore', email: 'frank@example.com', phone: '+1-234-567-8906', profession: 'Software Engineer', amount: 49, date: '2024-01-12', status: 'Completed' },
  { id: 'p7', playbookId: 11, playbookTitle: 'AI-Powered Customer Support', customerName: 'Grace Taylor', email: 'grace@example.com', phone: '+1-234-567-8907', profession: 'Support Lead', amount: 44, date: '2024-01-12', status: 'Pending' },
  { id: 'p8', playbookId: 2, playbookTitle: 'Midjourney Visual Systems', customerName: 'Henry Anderson', email: 'henry@example.com', phone: '+1-234-567-8908', profession: 'Art Director', amount: 29, date: '2024-01-11', status: 'Completed' },
  { id: 'p9', playbookId: 3, playbookTitle: 'AI Sales Automation Engine', customerName: 'Ivy Thomas', email: 'ivy@example.com', phone: '+1-234-567-8909', profession: 'Entrepreneur', amount: 49, date: '2024-01-11', status: 'Completed' },
  { id: 'p10', playbookId: 5, playbookTitle: 'Content Creation Flywheel', customerName: 'Jack Jackson', email: 'jack@example.com', phone: '+1-234-567-8910', profession: 'Blogger', amount: 39, date: '2024-01-10', status: 'Completed' },
  { id: 'p11', playbookId: 7, playbookTitle: 'Data Analysis with AI', customerName: 'Karen White', email: 'karen@example.com', phone: '+1-234-567-8911', profession: 'Business Analyst', amount: 59, date: '2024-01-10', status: 'Completed' },
  { id: 'p12', playbookId: 8, playbookTitle: 'Social Media Growth System', customerName: 'Leo Harris', email: 'leo@example.com', phone: '+1-234-567-8912', profession: 'Social Media Manager', amount: 34, date: '2024-01-09', status: 'Pending' },
  { id: 'p13', playbookId: 10, playbookTitle: 'Prompt Engineering for Developers', customerName: 'Mia Martin', email: 'mia@example.com', phone: '+1-234-567-8913', profession: 'Developer', amount: 49, date: '2024-01-09', status: 'Completed' },
  { id: 'p14', playbookId: 2, playbookTitle: 'Midjourney Visual Systems', customerName: 'Noah Thompson', email: 'noah@example.com', phone: '+1-234-567-8914', profession: 'Illustrator', amount: 29, date: '2024-01-08', status: 'Completed' },
  { id: 'p15', playbookId: 3, playbookTitle: 'AI Sales Automation Engine', customerName: 'Olivia Garcia', email: 'olivia@example.com', phone: '+1-234-567-8915', profession: 'Sales Director', amount: 49, date: '2024-01-08', status: 'Completed' },
  { id: 'p16', playbookId: 5, playbookTitle: 'Content Creation Flywheel', customerName: 'Peter Robinson', email: 'peter@example.com', phone: '+1-234-567-8916', profession: 'Copywriter', amount: 39, date: '2024-01-07', status: 'Completed' },
  { id: 'p17', playbookId: 11, playbookTitle: 'AI-Powered Customer Support', customerName: 'Quinn Clark', email: 'quinn@example.com', phone: '+1-234-567-8917', profession: 'Ops Manager', amount: 44, date: '2024-01-07', status: 'Completed' },
  { id: 'p18', playbookId: 7, playbookTitle: 'Data Analysis with AI', customerName: 'Rachel Rodriguez', email: 'rachel@example.com', phone: '+1-234-567-8918', profession: 'Data Scientist', amount: 59, date: '2024-01-06', status: 'Pending' },
  { id: 'p19', playbookId: 8, playbookTitle: 'Social Media Growth System', customerName: 'Sam Lewis', email: 'sam@example.com', phone: '+1-234-567-8919', profession: 'Growth Hacker', amount: 34, date: '2024-01-06', status: 'Completed' },
  { id: 'p20', playbookId: 10, playbookTitle: 'Prompt Engineering for Developers', customerName: 'Tina Lee', email: 'tina@example.com', phone: '+1-234-567-8920', profession: 'ML Engineer', amount: 49, date: '2024-01-05', status: 'Completed' },
];

export const mockFeedback: FeedbackEntry[] = [
  { id: 'f1', name: 'John Doe', email: 'john@example.com', category: 'Suggestion', message: 'Would love to see more playbooks on video generation tools like Runway and Pika.', date: '2024-01-15', status: 'New' },
  { id: 'f2', name: 'Jane Smith', email: 'jane@example.com', category: 'Feature Request', message: 'Please add a dark mode to the website. Reading at night would be much easier.', date: '2024-01-14', status: 'In Progress' },
  { id: 'f3', name: 'Mike Johnson', email: 'mike@example.com', category: 'Bug Report', message: 'The download link for the ChatGPT Mastery Blueprint seems to be broken on mobile Safari.', date: '2024-01-14', status: 'New' },
  { id: 'f4', name: 'Sarah Williams', email: 'sarah@example.com', category: 'General', message: 'Amazing platform! The playbooks have saved me countless hours of research.', date: '2024-01-13', status: 'Resolved' },
  { id: 'f5', name: 'Tom Brown', email: 'tom@example.com', category: 'Suggestion', message: 'Could you add a community forum where users can share their custom prompts?', date: '2024-01-13', status: 'New' },
  { id: 'f6', name: 'Lisa Davis', email: 'lisa@example.com', category: 'Feature Request', message: 'It would be great to have a bookmark feature to save playbooks for later.', date: '2024-01-12', status: 'In Progress' },
  { id: 'f7', name: 'Chris Miller', email: 'chris@example.com', category: 'Bug Report', message: 'The search bar does not filter correctly when using special characters.', date: '2024-01-12', status: 'Resolved' },
  { id: 'f8', name: 'Anna Wilson', email: 'anna@example.com', category: 'General', message: 'I have been recommending Echo Glitch to all my colleagues. Keep up the great work!', date: '2024-01-11', status: 'Resolved' },
  { id: 'f9', name: 'David Moore', email: 'david@example.com', category: 'Suggestion', message: 'Consider adding video tutorials alongside the written playbooks.', date: '2024-01-11', status: 'New' },
  { id: 'f10', name: 'Emily Taylor', email: 'emily@example.com', category: 'Feature Request', message: 'A wishlist feature would be amazing to track playbooks I want to buy later.', date: '2024-01-10', status: 'In Progress' },
  { id: 'f11', name: 'Robert Anderson', email: 'robert@example.com', category: 'Bug Report', message: 'Payment processing took a while on my last purchase. Had to refresh the page.', date: '2024-01-10', status: 'New' },
  { id: 'f12', name: 'Jessica Thomas', email: 'jessica@example.com', category: 'General', message: 'The quality of playbooks is consistently high. Best investment for AI learning.', date: '2024-01-09', status: 'Resolved' },
  { id: 'f13', name: 'Daniel Jackson', email: 'daniel@example.com', category: 'Suggestion', message: 'Add more enterprise-focused playbooks for team workflows.', date: '2024-01-09', status: 'New' },
  { id: 'f14', name: 'Laura Martin', email: 'laura@example.com', category: 'Feature Request', message: 'Can you integrate with Notion so I can export playbooks directly?', date: '2024-01-08', status: 'In Progress' },
  { id: 'f15', name: 'Kevin Garcia', email: 'kevin@example.com', category: 'General', message: 'Would be nice to have a certification or badge after completing playbooks.', date: '2024-01-08', status: 'New' },
];

export const mockCustomRequests: CustomRequest[] = [
  { id: 'cr1', name: 'Alice Cooper', email: 'alice.c@example.com', topic: 'Custom AI Chatbot', details: 'Need a custom AI chatbot for my e-commerce store that can handle product recommendations and order tracking.', budget: '$1,000 - $3,000', date: '2024-01-15', status: 'New' },
  { id: 'cr2', name: 'Bob Marley', email: 'bob.m@example.com', topic: 'AI Training Workshop', details: 'Looking for a team training session on AI tools for our marketing department of 15 people.', budget: '$2,000 - $5,000', date: '2024-01-14', status: 'Contacted' },
  { id: 'cr3', name: 'Carol King', email: 'carol.k@example.com', topic: 'Workflow Automation', details: 'Need help automating our content approval process using AI and no-code tools.', budget: '$500 - $1,500', date: '2024-01-14', status: 'In Progress' },
  { id: 'cr4', name: 'David Bowie', email: 'david.b@example.com', topic: 'AI Content Strategy', details: 'Looking for a comprehensive AI content strategy for our SaaS startup.', budget: '$3,000 - $8,000', date: '2024-01-13', status: 'New' },
  { id: 'cr5', name: 'Eva Cassidy', email: 'eva.c@example.com', topic: 'Custom Prompt Library', details: 'Need a custom prompt library built for our legal team to draft contracts faster.', budget: '$1,500 - $4,000', date: '2024-01-13', status: 'Contacted' },
  { id: 'cr6', name: 'Frank Sinatra', email: 'frank.s@example.com', topic: 'AI Data Pipeline', details: 'Need an automated data pipeline using AI to process customer feedback.', budget: '$5,000 - $10,000', date: '2024-01-12', status: 'In Progress' },
  { id: 'cr7', name: 'Grace Jones', email: 'grace.j@example.com', topic: 'AI Image Generation', details: 'Looking for custom AI image generation models trained on our brand style.', budget: '$2,000 - $6,000', date: '2024-01-12', status: 'New' },
  { id: 'cr8', name: 'Harry Styles', email: 'harry.s@example.com', topic: 'AI Voice Assistant', details: 'Need a custom voice assistant for our hotel chain to handle guest requests.', budget: '$10,000+', date: '2024-01-11', status: 'Completed' },
  { id: 'cr9', name: 'Ivy Queen', email: 'ivy.q@example.com', topic: 'AI Analytics Dashboard', details: 'Want a custom analytics dashboard with AI-powered insights for our sales data.', budget: '$3,000 - $7,000', date: '2024-01-11', status: 'Declined' },
  { id: 'cr10', name: 'John Legend', email: 'john.l@example.com', topic: 'AI Email Automation', details: 'Need help setting up AI-powered email sequences for our nonprofit organization.', budget: '$1,000 - $2,500', date: '2024-01-10', status: 'New' },
];

export const generateDailyStats = (): DailyStat[] => {
  const stats: DailyStat[] = [];
  const today = new Date('2024-01-15');
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    stats.push({
      date: date.toISOString().split('T')[0],
      purchases: Math.floor(Math.random() * 12) + 2,
      downloads: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 500) + 100,
      visits: Math.floor(Math.random() * 300) + 100,
    });
  }
  return stats;
};

export const mockDailyStats: DailyStat[] = generateDailyStats();

export const mockReviews: Review[] = [
  { id: 'r1', playbookId: 1, playbookTitle: 'ChatGPT Mastery Blueprint', userName: 'Alex Turner', avatar: '/avatar-1.jpg', rating: 5, comment: 'Completely transformed how I use ChatGPT. The system prompts alone are worth 10x the price.', date: '2024-01-14', approved: true },
  { id: 'r2', playbookId: 2, playbookTitle: 'Midjourney Visual Systems', userName: 'Bella Cruz', avatar: '/avatar-2.jpg', rating: 4, comment: 'Great resource for creating consistent visual styles. Could use more examples though.', date: '2024-01-13', approved: true },
  { id: 'r3', playbookId: 3, playbookTitle: 'AI Sales Automation Engine', userName: 'Charlie Park', avatar: '/avatar-3.jpg', rating: 5, comment: 'Our sales team closed 40% more deals after implementing these workflows.', date: '2024-01-12', approved: true },
  { id: 'r4', playbookId: 1, playbookTitle: 'ChatGPT Mastery Blueprint', userName: 'Diana Prince', avatar: '/avatar-4.jpg', rating: 5, comment: 'The best resource on prompt engineering I have ever found. Highly recommend!', date: '2024-01-11', approved: false },
  { id: 'r5', playbookId: 4, playbookTitle: 'No-Code AI Workflows', userName: 'Ethan Hunt', avatar: '/avatar-5.jpg', rating: 4, comment: 'Solid introduction to no-code automation. Perfect for non-technical founders.', date: '2024-01-10', approved: true },
  { id: 'r6', playbookId: 5, playbookTitle: 'Content Creation Flywheel', userName: 'Fiona Gallagher', avatar: '/avatar-6.jpg', rating: 5, comment: 'My content output has tripled since using this system. Absolutely incredible.', date: '2024-01-09', approved: true },
  { id: 'r7', playbookId: 2, playbookTitle: 'Midjourney Visual Systems', userName: 'George Martin', avatar: '/avatar-1.jpg', rating: 3, comment: 'Good content but some sections feel a bit rushed. Needs more depth.', date: '2024-01-08', approved: false },
  { id: 'r8', playbookId: 3, playbookTitle: 'AI Sales Automation Engine', userName: 'Hannah Abbott', avatar: '/avatar-2.jpg', rating: 5, comment: 'The CRM integration section saved me weeks of research.', date: '2024-01-07', approved: true },
];

export const mockAdminPlaybooks: AdminPlaybook[] = [
  { id: 1, title: 'ChatGPT Mastery Blueprint', description: 'Unlock the full potential of ChatGPT with advanced prompting techniques.', category: 'Prompt Engineering', price: 0, status: 'Published', downloads: 1240, coverImage: '/playbook-cover-1.jpg', fileUrl: '/files/chatgpt-mastery.zip', rating: 4.8, reviewCount: 127 },
  { id: 2, title: 'Midjourney Visual Systems', description: 'Create stunning AI-generated artwork with structured prompt frameworks.', category: 'Creative', price: 29, status: 'Published', downloads: 856, coverImage: '/playbook-cover-2.jpg', fileUrl: '/files/midjourney-visuals.zip', rating: 4.9, reviewCount: 84 },
  { id: 3, title: 'AI Sales Automation Engine', description: 'Build end-to-end sales pipelines using AI outreach and lead scoring.', category: 'AI Automation', price: 49, status: 'Published', downloads: 2341, coverImage: '/playbook-cover-3.jpg', fileUrl: '/files/ai-sales.zip', rating: 4.7, reviewCount: 203 },
  { id: 4, title: 'No-Code AI Workflows', description: 'Connect AI tools with no-code platforms to build powerful automations.', category: 'Workflow', price: 0, status: 'Published', downloads: 1567, coverImage: '/playbook-cover-4.jpg', fileUrl: '/files/nocode-workflows.zip', rating: 4.6, reviewCount: 156 },
  { id: 5, title: 'Content Creation Flywheel', description: 'Systematize your content production with AI-assisted workflows.', category: 'Business', price: 39, status: 'Published', downloads: 987, coverImage: '/playbook-cover-5.jpg', fileUrl: '/files/content-flywheel.zip', rating: 4.8, reviewCount: 91 },
  { id: 6, title: 'Claude Code Assistant', description: 'Leverage Claude for software development and technical documentation.', category: 'AI Automation', price: 0, status: 'Draft', downloads: 0, coverImage: '/playbook-cover-6.jpg', fileUrl: '/files/claude-code.zip', rating: 4.5, reviewCount: 72 },
  { id: 7, title: 'Data Analysis with AI', description: 'Transform raw data into actionable insights using AI-powered analysis.', category: 'Business', price: 59, status: 'Published', downloads: 654, coverImage: '/playbook-cover-1.jpg', fileUrl: '/files/data-analysis.zip', rating: 4.9, reviewCount: 48 },
  { id: 8, title: 'Social Media Growth System', description: 'Automate your social presence with AI-generated content calendars.', category: 'Business', price: 34, status: 'Published', downloads: 1123, coverImage: '/playbook-cover-2.jpg', fileUrl: '/files/social-growth.zip', rating: 4.6, reviewCount: 118 },
  { id: 9, title: 'AI Email Sequences That Convert', description: 'Craft high-converting email campaigns with personalized AI copy.', category: 'AI Automation', price: 0, status: 'Published', downloads: 1876, coverImage: '/playbook-cover-3.jpg', fileUrl: '/files/ai-emails.zip', rating: 4.7, reviewCount: 165 },
  { id: 10, title: 'Prompt Engineering for Developers', description: 'Master advanced prompting patterns for API integration.', category: 'Prompt Engineering', price: 49, status: 'Published', downloads: 743, coverImage: '/playbook-cover-4.jpg', fileUrl: '/files/prompt-dev.zip', rating: 4.8, reviewCount: 94 },
  { id: 11, title: 'AI-Powered Customer Support', description: 'Deploy intelligent support bots and knowledge base automation.', category: 'Workflow', price: 44, status: 'Draft', downloads: 0, coverImage: '/playbook-cover-5.jpg', fileUrl: '/files/ai-support.zip', rating: 4.5, reviewCount: 67 },
  { id: 12, title: 'Creative Writing with AI', description: 'Enhance your storytelling with AI co-writing and editing.', category: 'Creative', price: 0, status: 'Published', downloads: 1345, coverImage: '/playbook-cover-6.jpg', fileUrl: '/files/creative-writing.zip', rating: 4.7, reviewCount: 133 },
];

export const mockBlogPosts: BlogPost[] = [
  { id: 'b1', title: 'The Future of AI in Business', slug: 'future-of-ai-business', category: 'AI Trends', author: 'Alex Chen', excerpt: 'How artificial intelligence is reshaping the business landscape.', content: '# The Future of AI in Business\n\nArtificial intelligence is no longer a futuristic concept...', status: 'Published', date: '2024-01-12', featured: true },
  { id: 'b2', title: '10 ChatGPT Prompts That Actually Work', slug: 'chatgpt-prompts-that-work', category: 'Prompt Engineering', author: 'Sofia Martinez', excerpt: 'Battle-tested prompts for maximum productivity.', content: '# 10 ChatGPT Prompts That Actually Work\n\n1. The Expert Consultant...', status: 'Published', date: '2024-01-10', featured: false },
  { id: 'b3', title: 'Building Your First AI Agent', slug: 'first-ai-agent', category: 'Tutorial', author: 'Marcus Johnson', excerpt: 'A step-by-step guide to building autonomous AI agents.', content: '# Building Your First AI Agent\n\nAI agents are the next frontier...', status: 'Draft', date: '2024-01-08', featured: false },
  { id: 'b4', title: 'AI Tools Comparison 2024', slug: 'ai-tools-comparison-2024', category: 'AI Trends', author: 'Emily Park', excerpt: 'Comparing the top AI tools for productivity and creativity.', content: '# AI Tools Comparison 2024\n\nWith so many AI tools launching...', status: 'Published', date: '2024-01-05', featured: true },
  { id: 'b5', title: 'Midjourney vs DALL-E vs Stable Diffusion', slug: 'image-model-comparison', category: 'Creative', author: 'Jordan Blake', excerpt: 'Which AI image generator is right for your needs?', content: '# Midjourney vs DALL-E vs Stable Diffusion\n\nEach model has its strengths...', status: 'Published', date: '2024-01-03', featured: false },
  { id: 'b6', title: 'Automating Your Workflow with Zapier and AI', slug: 'zapier-ai-workflow', category: 'Tutorial', author: 'Ravi Sharma', excerpt: 'Connect AI tools to your existing workflows effortlessly.', content: '# Automating Your Workflow with Zapier and AI\n\nZapier is the glue...', status: 'Draft', date: '2024-01-01', featured: false },
];

export const mockNewsPosts: NewsPost[] = [
  { id: 'n1', title: 'Echo Glitch Reaches 10,000 Downloads', slug: '10k-downloads-milestone', category: 'Product Update', author: 'Echo Team', excerpt: 'We are thrilled to announce a major milestone.', content: '# Echo Glitch Reaches 10,000 Downloads\n\nThank you to our amazing community...', status: 'Published', date: '2024-01-14', featured: true },
  { id: 'n2', title: 'New Playbook: GPT-5 Readiness Guide', slug: 'gpt5-readiness-guide', category: 'Announcement', author: 'Alex Chen', excerpt: 'Prepare for the next generation of GPT models.', content: '# GPT-5 Readiness Guide\n\nThe next generation is coming...', status: 'Published', date: '2024-01-11', featured: false },
  { id: 'n3', title: 'AI Industry Report Q4 2023', slug: 'ai-industry-report-q4', category: 'Industry', author: 'Research Team', excerpt: 'Key findings from the latest AI industry analysis.', content: '# AI Industry Report Q4 2023\n\nThe AI industry continues to grow...', status: 'Published', date: '2024-01-09', featured: false },
  { id: 'n4', title: 'Introducing Custom Playbook Requests', slug: 'custom-playbook-requests', category: 'Product Update', author: 'Product Team', excerpt: 'Now you can request custom playbooks tailored to your needs.', content: '# Custom Playbook Requests\n\nWe are excited to announce...', status: 'Published', date: '2024-01-06', featured: true },
  { id: 'n5', title: 'OpenAI API Pricing Changes', slug: 'openai-pricing-changes', category: 'Industry', author: 'Editorial Team', excerpt: 'What the new pricing means for developers.', content: '# OpenAI API Pricing Changes\n\nOpenAI recently announced...', status: 'Draft', date: '2024-01-04', featured: false },
  { id: 'n6', title: 'Echo Glitch v2.0 Roadmap', slug: 'v2-roadmap', category: 'Announcement', author: 'Echo Team', excerpt: 'A sneak peek at what is coming in version 2.0.', content: '# Echo Glitch v2.0 Roadmap\n\nWe have been working hard...', status: 'Published', date: '2024-01-02', featured: true },
];

export const analyticsSummary = {
  totalPlaybooks: 24,
  totalPurchases: 156,
  totalDownloads: 1240,
  totalRevenue: 4280,
  activeUsers: 89,
  freeDownloads: 891,
  paidDownloads: 349,
};

export const trafficSources = [
  { name: 'Direct', value: 4200, color: '#6C63FF' },
  { name: 'Search', value: 3100, color: '#00BFA6' },
  { name: 'Social', value: 2300, color: '#F59E0B' },
  { name: 'Referral', value: 1400, color: '#F43F5E' },
];

export const playbooksByCategory = [
  { category: 'AI Automation', count: 6 },
  { category: 'Prompt Engineering', count: 4 },
  { category: 'Workflow', count: 3 },
  { category: 'Business', count: 6 },
  { category: 'Creative', count: 5 },
];

export const freeVsPaid = [
  { name: 'Free', value: 5, color: '#00BFA6' },
  { name: 'Paid', value: 7, color: '#6C63FF' },
];
