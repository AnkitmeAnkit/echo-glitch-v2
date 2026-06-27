import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  ArrowRight,
  X,
  User,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  Mail,
  FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/blogPosts';
import type { BlogPost, Category } from '@/data/blogPosts';

/* ─── easing ─── */
const easeExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── category colors ─── */
const categoryBadgeColors: Record<string, string> = {
  Tutorials: 'bg-accent-teal/15 text-accent-teal',
  Editorial: 'bg-accent-violet/15 text-accent-violet',
  'Case Studies': 'bg-accent-amber/15 text-accent-amber',
  'AI News': 'bg-accent-rose/15 text-accent-rose',
  'Prompt Engineering': 'bg-accent-violet/15 text-accent-violet',
  Automation: 'bg-accent-teal/15 text-accent-teal',
};

/* ─── toast ─── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-[200] bg-dark-base text-white rounded-xl px-5 py-3 shadow-lg flex items-center gap-2"
    >
      <Check className="w-4 h-4 text-accent-teal" />
      {message}
    </motion.div>
  );
}

/* ─── Blog Post Detail Modal ─── */
function BlogPostModal({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleShare = useCallback(
    (platform: 'twitter' | 'linkedin' | 'copy') => {
      const url = window.location.href;
      const text = encodeURIComponent(post.title);

      if (platform === 'twitter') {
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
      } else if (platform === 'linkedin') {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
      } else {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    },
    [post.title]
  );

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: easeExpo }}
        className="min-h-[100dvh] bg-[#F4F7F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3, type: 'spring' }}
                className={`inline-block text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${
                  categoryBadgeColors[post.category] ||
                  'bg-accent-violet/15 text-accent-violet'
                }`}
              >
                {post.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: easeExpo }}
                className="font-clash font-bold text-white text-2xl md:text-4xl lg:text-5xl leading-tight mb-4"
              >
                {post.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: easeExpo }}
                className="flex flex-wrap items-center gap-4 text-white/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="text-sm text-[#4A5568] font-medium flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            <button
              onClick={() => handleShare('twitter')}
              className="w-9 h-9 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-9 h-9 rounded-full bg-[#0077B5]/10 flex items-center justify-center hover:bg-[#0077B5]/20 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent-teal" />
              ) : (
                <LinkIcon className="w-4 h-4 text-[#4A5568]" />
              )}
            </button>
          </motion.div>

          {/* Markdown Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: easeExpo }}
            className="prose prose-lg max-w-none blog-prose"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </motion.div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <h3 className="font-clash font-semibold text-xl mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp, i) => (
                  <motion.div
                    key={rp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: easeExpo }}
                    className="group cursor-pointer"
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <div className="overflow-hidden rounded-xl mb-3">
                      <img
                        src={rp.coverImage}
                        alt={rp.title}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-medium text-sm group-hover:text-accent-violet transition-colors line-clamp-2">
                      {rp.title}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-12 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[#4A5568] hover:text-accent-violet transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Blog Page ─── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });
      if (!error && data) {
        // Map Supabase snake_case to camelCase expected by the UI
        const mapped: BlogPost[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.cover_image || '',
          status: p.status,
          featured: p.featured,
          author: { name: p.author || 'Echo Glitch', avatar: '' },
          date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: `${Math.max(1, Math.ceil((p.content?.split(' ').length || 0) / 200))} min read`,
        }));
        setBlogPosts(mapped);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts.filter((p) => p.id !== featuredPost?.id)
      : blogPosts.filter(
          (p) => p.category === activeCategory && p.id !== featuredPost?.id
        );

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email.trim()) {
        setToast('Thanks for subscribing! Check your inbox soon.');
        setEmail('');
      }
    },
    [email]
  );

  return (
    <div className="bg-[#F4F7F9]">
      {/* ─── Blog Prose Styles ─── */}
      <style>{`
        .blog-prose { color: #1A1A1A; }
        .blog-prose h1 { font-family: 'Clash Display', system-ui, sans-serif; font-weight: 700; font-size: 2rem; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.02em; }
        .blog-prose h2 { font-family: 'Clash Display', system-ui, sans-serif; font-weight: 600; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; letter-spacing: -0.01em; }
        .blog-prose h3 { font-family: 'Clash Display', system-ui, sans-serif; font-weight: 600; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .blog-prose p { margin-bottom: 1rem; line-height: 1.7; color: #4A5568; }
        .blog-prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-prose li { margin-bottom: 0.35rem; line-height: 1.6; color: #4A5568; }
        .blog-prose blockquote { border-left: 3px solid #6C63FF; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #4A5568; }
        .blog-prose pre { background: #0F172A; color: #E2E8F0; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.5; }
        .blog-prose code { background: rgba(108, 99, 255, 0.1); color: #6C63FF; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; }
        .blog-prose pre code { background: none; color: inherit; padding: 0; }
        .blog-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .blog-prose th { background: rgba(108, 99, 255, 0.08); font-weight: 600; text-align: left; padding: 0.6rem 0.75rem; border: 1px solid #E2E8F0; }
        .blog-prose td { padding: 0.6rem 0.75rem; border: 1px solid #E2E8F0; }
        .blog-prose tr:nth-child(even) { background: rgba(244, 247, 249, 0.5); }
        .blog-prose a { color: #6C63FF; text-decoration: underline; text-underline-offset: 2px; }
        .blog-prose a:hover { color: #00BFA6; }
        .blog-prose hr { border: none; border-top: 1px solid #E2E8F0; margin: 2rem 0; }
        .blog-prose strong { color: #1A1A1A; font-weight: 600; }
      `}</style>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* ─── Post Detail Modal ─── */}
      <AnimatePresence>
        {selectedPost && (
          <BlogPostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>

      {/* ════════════ Section 1: Featured Hero ════════════ */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          {featuredPost?.coverImage ? (
            <img src={featuredPost.coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #6C63FF 60%, #00BFA6 100%)' }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(108,99,255,0.6) 50%, rgba(0,191,166,0.4) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 md:py-32 w-full">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : featuredPost ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Left: Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: easeExpo }}
                className="lg:col-span-3 hidden lg:block"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  {featuredPost.coverImage ? (
                    <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full aspect-[16/10] object-cover" />
                  ) : (
                    <div className="w-full aspect-[16/10] bg-white/10 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right: Content */}
              <div className="lg:col-span-2">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className="inline-block bg-accent-violet text-white text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                >
                  FEATURED
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: easeExpo }}
                  className="font-clash font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-4"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {featuredPost.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: easeExpo }}
                  className="text-white/80 text-base md:text-lg leading-relaxed mb-6"
                >
                  {featuredPost.excerpt}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: easeExpo }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-violet/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{featuredPost.author.name}</p>
                    <p className="text-white/60 text-xs">{featuredPost.date} · {featuredPost.readTime}</p>
                  </div>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: easeExpo }}
                  onClick={() => setSelectedPost(featuredPost)}
                  className="inline-flex items-center gap-2 bg-accent-violet text-white rounded-full px-8 py-3.5 font-medium transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            /* Empty state hero */
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-white/50" />
              </div>
              <h1 className="font-clash font-bold text-white text-3xl md:text-4xl mb-3">No articles yet</h1>
              <p className="text-white/60 text-lg max-w-md">The first article is being prepared. Check back soon for in-depth AI guides and tutorials.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ Section 2: Category Filter + Post Grid ════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Category Filter */}
          <div className="relative mb-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="hidden md:flex w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#4A5568]" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }
                }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      'whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ' +
                      (activeCategory === cat
                        ? 'bg-accent-violet text-white shadow-md'
                        : 'bg-white text-[#4A5568] hover:text-accent-violet hover:bg-white shadow-sm border border-gray-100')
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleScroll('right')}
                className="hidden md:flex w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#4A5568]" />
              </button>
            </div>
          </div>

          {/* Blog Post Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    ease: easeExpo,
                    delay: index * 0.08,
                  }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1 h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category */}
                      <span
                        className={`inline-block self-start text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${
                          categoryBadgeColors[post.category] ||
                          'bg-accent-violet/15 text-accent-violet'
                        }`}
                      >
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-clash font-semibold text-lg leading-snug mb-2 group-hover:text-accent-violet transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-[#4A5568] text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-[#A0AEC0] pt-4 border-t border-gray-100">
                        <span className="font-medium text-[#4A5568]">
                          {post.author.name}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#A0AEC0]" />
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-[#A0AEC0] text-lg">
                No posts found in this category.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 text-accent-violet font-medium hover:underline"
              >
                View all posts
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ════════════ Section 3: Newsletter CTA ════════════ */}
      <section className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeExpo }}
          className="bg-gradient-to-r from-accent-violet to-accent-teal py-16 md:py-20 px-6"
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: easeExpo }}
            >
              <Mail className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="font-clash font-bold text-white text-3xl md:text-4xl mb-4">
                Stay Ahead of the Curve
              </h2>
              <p className="text-white/80 text-base md:text-lg mb-8">
                Get the latest AI playbooks, tutorials, and insights delivered to
                your inbox.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: easeExpo }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full sm:w-80 bg-white/20 border border-white/30 rounded-full px-6 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-white text-accent-violet rounded-full px-6 py-3 font-medium transition-all duration-200 hover:brightness-110 hover:scale-[1.02] whitespace-nowrap"
              >
                Subscribe
              </button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-white/50 text-sm mt-4"
            >
              No spam. Unsubscribe anytime.
            </motion.p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
