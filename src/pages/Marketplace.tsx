import { useState, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Loader2 } from 'lucide-react';
import { playbooks, categories, sortOptions } from '@/data/playbooks';
import type { Category, SortOption } from '@/data/playbooks';
import PlaybookCard from '@/components/PlaybookCard';

const ReactiveGlassField = lazy(() => import('@/components/ReactiveGlassField'));

const filterCategories: readonly Category[] = categories;

function MorphingBlob({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  return (
    <motion.div
      layoutId="category-blob"
      className="absolute inset-0 -z-10"
      style={{
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12), rgba(0, 191, 166, 0.12))',
        animation: 'morph 6s ease-in-out infinite',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    />
  );
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'paid'>('all');

  // Custom request form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: '',
    request: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const filteredPlaybooks = useMemo(() => {
    let result = [...playbooks];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Type
    if (typeFilter === 'free') result = result.filter((p) => p.price === 0);
    if (typeFilter === 'paid') result = result.filter((p) => p.price > 0);

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, typeFilter]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Invalid email address';
    if (!formData.request.trim()) errors.request = 'Request details are required';

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      showToast('Your request has been submitted. We\'ll be in touch within 24 hours.');
      setFormData({ fullName: '', email: '', category: '', request: '' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setSortBy('popular');
    setTypeFilter('all');
  };

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
      {/* CSS for morph animation */}
      <style>{`
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent-violet animate-spin" />
            </div>
          }
        >
          <ReactiveGlassField />
        </Suspense>

        <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-clash font-bold text-[clamp(2.5rem,5vw,4.5rem)] text-[#1A1A1A] leading-[1.0] tracking-[-0.02em] mb-4"
          >
            The Arsenal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="text-[#4A5568] text-lg md:text-xl max-w-[600px] mx-auto mb-8"
          >
            Browse every playbook in the Echo Glitch ecosystem. Free to download, premium to unlock.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="relative max-w-[560px] mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0AEC0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks..."
              className="w-full pl-13 pr-5 py-4 rounded-full text-[#1A1A1A] placeholder-[#A0AEC0] text-base outline-none transition-all border border-transparent focus:border-accent-violet/30"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 4px 24px rgba(108, 99, 255, 0.1)',
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* --- FILTER BAR + PLAYBOOK GRID --- */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1280px] mx-auto">
          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="sticky top-[72px] z-40 py-4 mb-8 rounded-2xl px-4 md:px-6 -mx-2 md:-mx-4"
            style={{
              background: 'rgba(244, 247, 249, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    <MorphingBlob isActive={activeCategory === cat} />
                    <span
                      className={
                        activeCategory === cat
                          ? 'text-white'
                          : 'text-[#4A5568] hover:text-accent-violet'
                      }
                    >
                      {cat}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort + Type */}
              <div className="flex items-center gap-3">
                {/* Type Toggle */}
                <div className="flex items-center p-1 rounded-lg bg-gray-100">
                  {(['all', 'free', 'paid'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={
                        'px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ' +
                        (typeFilter === t
                          ? 'bg-white text-accent-violet shadow-sm'
                          : 'text-[#4A5568] hover:text-[#1A1A1A]')
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-sm text-[#1A1A1A] outline-none cursor-pointer border-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Playbook Grid */}
          <AnimatePresence mode="wait">
            {filteredPlaybooks.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${sortBy}-${typeFilter}-${searchQuery}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredPlaybooks.map((playbook, i) => (
                  <PlaybookCard key={playbook.id} playbook={playbook} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[#A0AEC0]" />
                </div>
                <h3 className="font-clash font-semibold text-xl text-[#1A1A1A] mb-2">
                  No playbooks match your search
                </h3>
                <p className="text-[#4A5568] text-sm mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-accent-violet text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:brightness-110 hover:scale-[1.02]"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- CUSTOM PLAYBOOK REQUEST --- */}
      <section className="bg-dark-base text-white py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="lg:col-span-2"
            >
              <h2 className="font-clash font-semibold text-[clamp(2rem,4vw,3rem)] leading-[1.0] tracking-[-0.02em] mb-4">
                Need Something Custom?
              </h2>
              <p className="text-[#A0AEC0] text-lg leading-relaxed mb-8">
                Can&apos;t find the exact playbook you need? Request a custom-built playbook tailored to your workflow, industry, or specific AI tool.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Tailored to your exact use case',
                  'Delivered as a single .html file',
                  'Includes video walkthrough',
                  '48-hour delivery guarantee',
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent-teal/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-accent-teal" />
                    </div>
                    <span className="text-sm text-[#CBD5E0]">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-accent-amber text-dark-base font-bold text-sm">
                From $99
              </div>
            </motion.div>

            {/* Right Column — Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleFormSubmit}
                className="p-6 md:p-8 rounded-2xl border border-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0 }}
                  >
                    <label className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Your name"
                      className={
                        'w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-[#4A5568] outline-none transition-all ' +
                        (formErrors.fullName
                          ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                          : 'border-white/10 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                      }
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    {formErrors.fullName && (
                      <p className="text-accent-rose text-xs mt-1">{formErrors.fullName}</p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 }}
                  >
                    <label className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      className={
                        'w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-[#4A5568] outline-none transition-all ' +
                        (formErrors.email
                          ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                          : 'border-white/10 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                      }
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    {formErrors.email && (
                      <p className="text-accent-rose text-xs mt-1">{formErrors.email}</p>
                    )}
                  </motion.div>
                </div>

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.16 }}
                  className="mb-4"
                >
                  <label className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-1.5">
                    Topic / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm text-white outline-none transition-all focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 appearance-none"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <option value="" className="bg-dark-base text-[#4A5568]">
                      Select a category...
                    </option>
                    <option value="ai-automation" className="bg-dark-base">
                      AI Automation
                    </option>
                    <option value="prompt-engineering" className="bg-dark-base">
                      Prompt Engineering
                    </option>
                    <option value="workflow" className="bg-dark-base">
                      Workflow
                    </option>
                    <option value="business" className="bg-dark-base">
                      Business
                    </option>
                    <option value="creative" className="bg-dark-base">
                      Creative
                    </option>
                  </select>
                </motion.div>

                {/* Detailed Request */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24 }}
                  className="mb-6"
                >
                  <label className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-1.5">
                    Detailed Request
                  </label>
                  <textarea
                    value={formData.request}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, request: e.target.value }))
                    }
                    placeholder="Describe what you need the playbook to do..."
                    rows={4}
                    className={
                      'w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-[#4A5568] outline-none transition-all resize-none ' +
                      (formErrors.request
                        ? 'border-accent-rose focus:border-accent-rose focus:ring-2 focus:ring-accent-rose/20'
                        : 'border-white/10 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20')
                    }
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  {formErrors.request && (
                    <p className="text-accent-rose text-xs mt-1">{formErrors.request}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 }}
                >
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent-violet to-accent-teal text-white rounded-full py-3.5 font-medium text-sm transition-all hover:brightness-110 hover:scale-[1.02]"
                  >
                    Request Custom Playbook
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #00BFA6 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-[600px] mx-auto"
        >
          <h2 className="font-clash font-semibold text-[clamp(2rem,4vw,3rem)] text-white leading-[1.0] mb-4">
            Ready to Execute?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Browse the full collection and find your next competitive edge.
          </p>
          <motion.button
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-accent-violet rounded-full px-8 py-3.5 font-medium text-sm transition-all hover:brightness-110 hover:scale-[1.02]"
          >
            Explore All Playbooks &rarr;
          </motion.button>
        </motion.div>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="fixed bottom-6 right-6 z-[300] px-4 py-3 rounded-xl text-white text-sm font-medium"
            style={{ background: '#0F172A' }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
