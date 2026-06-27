import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Download,
  CreditCard,
  Heart,
  ListChecks,
  MessageSquare,
  Briefcase,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { getPlaybookById, getRelatedPlaybooks } from '@/data/playbooks';
import { getReviewsByPlaybookId } from '@/data/reviews';
import PlaybookCard from '@/components/PlaybookCard';
import PurchaseModal from '@/components/PurchaseModal';

/* ------------------------------------------------------------------ */
/*  3D Tilt Card Preview                                              */
/* ------------------------------------------------------------------ */
function TiltCardPreview({ coverImage, title }: { coverImage: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const cardStyle = {
    transform: `perspective(1200px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
    transition: 'transform 0.1s ease-out',
    transformStyle: 'preserve-3d' as const,
  };

  const glareStyle = {
    position: 'absolute' as const,
    inset: 0,
    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
    opacity: 0.6,
    pointerEvents: 'none' as const,
    mixBlendMode: 'overlay' as const,
    borderRadius: 'inherit',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setTransform({ rotateX, rotateY, scale: 1.02 });
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[3/4] max-w-[420px] rounded-2xl bg-glass backdrop-blur-xl border border-glass shadow-xl mx-auto"
    >
      <div style={cardStyle} className="w-full h-full rounded-2xl overflow-hidden relative">
        <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        <div style={glareStyle} />
        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Preview</p>
          <p className="text-white font-clash font-semibold text-lg">{title}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature Icons                                                      */
/* ------------------------------------------------------------------ */
const featureIcons = {
  'Step-by-Step System': ListChecks,
  'Ready-to-Use Prompts': MessageSquare,
  'Real-World Examples': Briefcase,
};

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function PlaybookDetail() {
  const { id } = useParams<{ id: string }>();
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [helpfulMap, setHelpfulMap] = useState<Record<number, boolean>>({});

  const playbookId = parseInt(id || '1', 10);
  const playbook = useMemo(() => getPlaybookById(playbookId), [playbookId]);
  const reviews = useMemo(() => getReviewsByPlaybookId(playbookId), [playbookId]);
  const related = useMemo(() => getRelatedPlaybooks(playbookId, 3), [playbookId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setVisibleReviews(3);
  }, [playbookId]);

  if (!playbook) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-clash font-semibold text-3xl text-[#1A1A1A] mb-4">
          Playbook Not Found
        </h1>
        <p className="text-[#4A5568] mb-6">
          The playbook you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/marketplace"
          className="bg-accent-violet text-white rounded-full px-6 py-2.5 font-medium text-sm transition-all hover:brightness-110"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isFree = playbook.price === 0;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const features = [
    {
      title: 'Step-by-Step System',
      description: 'Detailed, numbered instructions with screenshots',
      icon: 'ListChecks' as const,
    },
    {
      title: 'Ready-to-Use Prompts',
      description: 'Copy-paste prompts optimized for results',
      icon: 'MessageSquare' as const,
    },
    {
      title: 'Real-World Examples',
      description: 'Case studies from actual implementations',
      icon: 'Briefcase' as const,
    },
  ];

  const toggleHelpful = (reviewId: number) => {
    setHelpfulMap((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
      {/* --- HERO SECTION --- */}
      <section className="min-h-[80vh] py-16 md:py-24 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-xs text-[#A0AEC0] mb-4 uppercase tracking-wider">
                <Link to="/" className="hover:text-accent-violet transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/marketplace" className="hover:text-accent-violet transition-colors">
                  Playbooks
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span>{playbook.category}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#4A5568]">{playbook.title}</span>
              </nav>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={
                    'px-3 py-1 rounded-full text-xs font-semibold text-white ' +
                    (isFree ? 'bg-accent-teal' : 'bg-accent-violet')
                  }
                >
                  {isFree ? 'FREE' : `$${playbook.price}`}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-violet/10 text-accent-violet">
                  {playbook.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-clash font-bold text-[clamp(2.5rem,4vw,3.5rem)] text-[#1A1A1A] leading-[1.0] tracking-[-0.02em] mb-4">
                {playbook.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={
                        'w-5 h-5 ' +
                        (i < Math.floor(avgRating)
                          ? 'text-accent-amber fill-accent-amber'
                          : 'text-gray-300 fill-gray-300')
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    document
                      .getElementById('reviews-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-[#4A5568] hover:text-accent-violet transition-colors"
                >
                  {avgRating.toFixed(1)} ({reviews.length} reviews)
                </button>
              </div>

              {/* Description */}
              <p className="text-[#4A5568] text-base leading-relaxed mb-6 max-w-[520px]">
                {playbook.description} This comprehensive playbook gives you everything you need to
                master {playbook.category.toLowerCase()} with AI. Built by {playbook.author} for
                professionals who want results, not theory.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {playbook.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-[#4A5568]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isFree) {
                      // Free: show toast or download
                    } else {
                      setPurchaseOpen(true);
                    }
                  }}
                  className={
                    'flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm transition-all hover:brightness-110 ' +
                    (isFree
                      ? 'bg-accent-teal text-white'
                      : 'bg-accent-violet text-white')
                  }
                >
                  {isFree ? <Download className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  {isFree ? 'Download Now' : `Buy Now — $${playbook.price}`}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWishlisted((w) => !w)}
                  className={
                    'flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium transition-all border ' +
                    (wishlisted
                      ? 'border-accent-rose text-accent-rose bg-accent-rose/5'
                      : 'border-gray-200 text-[#4A5568] hover:border-gray-300')
                  }
                >
                  <Heart
                    className={'w-4 h-4 ' + (wishlisted ? 'fill-accent-rose' : '')}
                  />
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column — 3D Tilt Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <TiltCardPreview coverImage={playbook.coverImage} title={playbook.title} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHAT'S INSIDE --- */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-clash font-semibold text-[clamp(2rem,4vw,3rem)] text-[#1A1A1A] leading-[1.0] tracking-[-0.02em] text-center mb-12"
          >
            What&apos;s Inside
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = featureIcons[feature.title as keyof typeof featureIcons];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  className="glass-panel p-6 md:p-8"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-accent-violet" />
                  </div>
                  <h3 className="font-clash font-semibold text-lg text-[#1A1A1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5568] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section id="reviews-section" className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Aggregate Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          >
            <div className="flex items-center gap-4">
              <span className="font-clash font-bold text-[4rem] leading-none text-[#1A1A1A]">
                {avgRating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={
                        'w-5 h-5 ' +
                        (i < Math.floor(avgRating)
                          ? 'text-accent-amber fill-accent-amber'
                          : 'text-gray-300 fill-gray-300')
                      }
                    />
                  ))}
                </div>
                <p className="text-[#4A5568] text-sm">{reviews.length} reviews</p>
              </div>
            </div>
            <button className="bg-transparent border-2 border-accent-violet text-accent-violet rounded-full px-6 py-2.5 font-medium text-sm transition-all hover:bg-accent-violet hover:text-white self-start">
              Write a Review
            </button>
          </motion.div>

          {/* Review List */}
          <div className="space-y-4">
            <AnimatePresence>
              {reviews.slice(0, visibleReviews).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  className="glass-panel p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm text-[#1A1A1A]">{review.name}</span>
                        <span className="text-[#A0AEC0] text-xs">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={
                              'w-3.5 h-3.5 ' +
                              (i < review.rating
                                ? 'text-accent-amber fill-accent-amber'
                                : 'text-gray-300 fill-gray-300')
                            }
                          />
                        ))}
                      </div>
                      <p className="text-[#4A5568] text-sm leading-relaxed mb-3">
                        {review.text}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleHelpful(review.id)}
                          className={
                            'flex items-center gap-1.5 text-xs transition-colors ' +
                            (helpfulMap[review.id]
                              ? 'text-accent-violet'
                              : 'text-[#A0AEC0] hover:text-[#4A5568]')
                          }
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Helpful ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-[#A0AEC0] hover:text-[#4A5568] transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" />
                          Not helpful
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {visibleReviews < reviews.length && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-6"
            >
              <button
                onClick={() => setVisibleReviews((v) => Math.min(v + 3, reviews.length))}
                className="bg-transparent border border-gray-200 text-[#4A5568] rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:border-accent-violet hover:text-accent-violet"
              >
                Load More Reviews
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- RELATED PLAYBOOKS --- */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-clash font-semibold text-[clamp(2rem,4vw,3rem)] text-[#1A1A1A] leading-[1.0] tracking-[-0.02em] mb-10"
          >
            You Might Also Like
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rp, i) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <PlaybookCard playbook={rp} index={0} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="glass-panel p-10 md:p-16 text-center"
          >
            <h2 className="font-clash font-semibold text-3xl text-[#1A1A1A] mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-[#4A5568] mb-8 max-w-[480px] mx-auto">
              Get instant access to this playbook and start seeing results today.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  if (isFree) {
                    // download
                  } else {
                    setPurchaseOpen(true);
                  }
                }}
                className={
                  'flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm transition-all hover:brightness-110 hover:scale-[1.02] ' +
                  (isFree ? 'bg-accent-teal text-white' : 'bg-accent-violet text-white')
                }
              >
                {isFree ? <Download className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                {isFree ? 'Download Now' : `Buy Now — $${playbook.price}`}
              </button>
              <Link
                to="/marketplace"
                className="bg-transparent border-2 border-accent-violet text-accent-violet rounded-full px-6 py-3 font-medium text-sm transition-all hover:bg-accent-violet hover:text-white"
              >
                Browse All Playbooks
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PURCHASE MODAL --- */}
      <PurchaseModal
        isOpen={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
        playbookTitle={playbook.title}
        playbookPrice={playbook.price}
      />
    </div>
  );
}
