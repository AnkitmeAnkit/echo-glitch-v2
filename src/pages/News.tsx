import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Rss,
  Mail,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { newsItems, newsCategories, categoryColors } from '@/data/newsItems';
import type { NewsItem, NewsCategory } from '@/data/newsItems';

/* ─── easing ─── */
const easeExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

/* ─── News Detail Modal ─── */
function NewsDetailModal({
  item,
  onClose,
}: {
  item: NewsItem;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.4, ease: easeExpo }}
        className="min-h-[100dvh] bg-[#F4F7F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-dark-base py-12 md:py-16">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="max-w-3xl mx-auto px-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
              className={`inline-block text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${
                categoryColors[item.category] || 'bg-accent-violet text-white'
              }`}
            >
              {item.category}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: easeExpo }}
              className="font-clash font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-4"
            >
              {item.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-[#A0AEC0] text-sm"
            >
              {item.date}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: easeExpo }}
            className="blog-prose"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[#4A5568] hover:text-accent-violet transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to News
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Timeline Card ─── */
function TimelineCard({
  item,
  index,
  onSelect,
}: {
  item: NewsItem;
  index: number;
  onSelect: (item: NewsItem) => void;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start md:items-center">
      {/* Desktop: alternating layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8 w-full">
        {/* Left side */}
        <div
          className={
            isLeft
              ? 'flex justify-end'
              : 'flex justify-start col-start-2'
          }
        >
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: easeExpo, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div
              className="glass-panel p-6 cursor-pointer transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1 hover:border-accent-violet/30"
              onClick={() => onSelect(item)}
            >
              {/* Date & Category */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-[#A0AEC0] uppercase tracking-wider font-medium">
                  {item.date}
                </span>
                <span
                  className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    categoryColors[item.category] ||
                    'bg-accent-violet text-white'
                  }`}
                >
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-clash font-semibold text-lg leading-snug mb-2 group-hover:text-accent-violet transition-colors">
                {item.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[#4A5568] text-sm leading-relaxed mb-4 line-clamp-3">
                {item.excerpt}
              </p>

              {/* Read More */}
              <span className="inline-flex items-center gap-1 text-accent-violet text-sm font-medium hover:gap-2 transition-all">
                Read More
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right side (empty on alternating) */}
        <div className={isLeft ? 'col-start-2' : 'col-start-1 row-start-1'} />
      </div>

      {/* Mobile: always left */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: easeExpo }}
        className="md:hidden w-full pl-8"
      >
        <div
          className="glass-panel p-5 cursor-pointer transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1"
          onClick={() => onSelect(item)}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-[#A0AEC0] uppercase tracking-wider">
              {item.date}
            </span>
            <span
              className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                categoryColors[item.category] || 'bg-accent-violet text-white'
              }`}
            >
              {item.category}
            </span>
          </div>
          <h3 className="font-clash font-semibold text-base leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-[#4A5568] text-sm leading-relaxed mb-3 line-clamp-2">
            {item.excerpt}
          </p>
          <span className="inline-flex items-center gap-1 text-accent-violet text-sm font-medium">
            Read More
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Social Link Row ─── */
function SocialLinkRow({
  icon: Icon,
  label,
  href,
  index,
}: {
  icon: typeof Twitter;
  label: string;
  href: string;
  index: number;
}) {
  return (
    <motion.a
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: easeExpo }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel p-4 flex items-center justify-between group hover:shadow-glass-lg hover:border-accent-violet/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-violet/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent-violet" />
        </div>
        <span className="font-medium text-[#1A1A1A]">{label}</span>
      </div>
      <div className="flex items-center gap-1 text-[#A0AEC0] group-hover:text-accent-violet transition-colors text-sm">
        <span className="hidden sm:inline">Follow</span>
        <ExternalLink className="w-4 h-4" />
      </div>
    </motion.a>
  );
}

/* ─── Main News Page ─── */
export default function News() {
  const [activeFilter, setActiveFilter] = useState<NewsCategory>('All News');
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    activeFilter === 'All News'
      ? newsItems
      : newsItems.filter((item) => {
          if (activeFilter === 'Product Updates') return item.category === 'Product Update';
          if (activeFilter === 'Announcements') return item.category === 'Announcement';
          return item.category === activeFilter;
        });

  const handleEmailClick = useCallback(() => {
    setToast('Coming soon! Email updates will be available shortly.');
  }, []);

  return (
    <div className="bg-[#F4F7F9]">
      {/* ─── Styles ─── */}
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

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selectedItem && (
          <NewsDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      {/* ════════════ Section 1: Hero ════════════ */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20 md:py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeExpo }}
            className="font-clash font-bold text-[#1A1A1A] text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            The Signal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: easeExpo }}
            className="text-[#4A5568] text-base md:text-lg max-w-xl mx-auto mb-10"
          >
            AI industry news, product updates, and Echo Glitch announcements.
          </motion.p>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: easeExpo }}
            className="flex flex-wrap justify-center gap-2"
          >
            {newsCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={
                    'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ' +
                    (isActive
                      ? 'bg-accent-violet text-white shadow-md'
                      : 'bg-white text-[#4A5568] hover:text-[#1A1A1A] shadow-sm border border-gray-100 hover:border-gray-200')
                  }
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════ Section 2: Timeline ════════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div ref={timelineRef} className="relative">
            {/* Central Line — Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 2, ease: easeExpo }}
                className="w-full h-full origin-top"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, #6C63FF 0, #6C63FF 8px, transparent 8px, transparent 16px)',
                  opacity: 0.2,
                }}
              />
            </div>

            {/* Central Line — Mobile */}
            <div className="md:hidden absolute left-3 top-0 bottom-0 w-0.5">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 1.5, ease: easeExpo }}
                className="w-full h-full origin-top"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, #6C63FF 0, #6C63FF 8px, transparent 8px, transparent 16px)',
                  opacity: 0.2,
                }}
              />
            </div>

            {/* Timeline Items */}
            <div className="relative space-y-8 md:space-y-12">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline Node — Desktop */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      delay: 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="w-3 h-3 rounded-full bg-accent-violet shadow-md shadow-accent-violet/30" />
                  </motion.div>

                  {/* Timeline Node — Mobile */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="md:hidden absolute left-3 -translate-x-1/2 z-10"
                  >
                    <div className="w-3 h-3 rounded-full bg-accent-violet shadow-md shadow-accent-violet/30" />
                  </motion.div>

                  <TimelineCard
                    item={item}
                    index={index}
                    onSelect={setSelectedItem}
                  />
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-[#A0AEC0] text-lg">
                  No news items in this category.
                </p>
                <button
                  onClick={() => setActiveFilter('All News')}
                  className="mt-4 text-accent-violet font-medium hover:underline"
                >
                  View all news
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════ Section 3: RSS + Social CTA ════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: RSS / Email */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: easeExpo }}
            >
              <h3 className="font-clash font-semibold text-2xl md:text-3xl text-[#1A1A1A] mb-4">
                Never Miss an Update
              </h3>
              <p className="text-[#4A5568] leading-relaxed mb-8">
                Subscribe to our news feed for instant updates on new playbooks,
                features, and AI industry developments.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    setToast('RSS feed coming soon!')
                  }
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-accent-violet text-accent-violet rounded-full px-6 py-3 font-medium transition-all duration-200 hover:bg-accent-violet hover:text-white"
                >
                  <Rss className="w-4 h-4" />
                  Subscribe via RSS
                </button>
                <button
                  onClick={handleEmailClick}
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#4A5568] text-[#4A5568] rounded-full px-6 py-3 font-medium transition-all duration-200 hover:bg-[#4A5568] hover:text-white"
                >
                  <Mail className="w-4 h-4" />
                  Get Email Updates
                </button>
              </div>
            </motion.div>

            {/* Right: Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: easeExpo, delay: 0.15 }}
            >
              <h3 className="font-clash font-semibold text-2xl md:text-3xl text-[#1A1A1A] mb-4">
                Follow Echo Glitch
              </h3>
              <p className="text-[#4A5568] leading-relaxed mb-8">
                Join the conversation and stay connected with the community.
              </p>
              <div className="space-y-3">
                <SocialLinkRow
                  icon={Twitter}
                  label="Twitter / X"
                  href="https://twitter.com"
                  index={0}
                />
                <SocialLinkRow
                  icon={Linkedin}
                  label="LinkedIn"
                  href="https://linkedin.com"
                  index={1}
                />
                <SocialLinkRow
                  icon={Github}
                  label="GitHub"
                  href="https://github.com"
                  index={2}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
