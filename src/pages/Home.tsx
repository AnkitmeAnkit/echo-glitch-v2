import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Search, MousePointer, CreditCard, Rocket,
  Star, ChevronLeft, ChevronRight, Send
} from 'lucide-react';

const FluidWarpGrid = lazy(() => import('@/components/FluidWarpGrid'));

/* ──────────────────────────────────────────────
   Animation helpers
   ────────────────────────────────────────────── */


const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const cardCascade = {
  hidden: { opacity: 0, y: 120, rotateX: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: {
      duration: 1.2,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */
const playbooks = [
  { id: 1, title: 'ChatGPT Mastery Blueprint', desc: 'Unlock the full potential of ChatGPT with advanced prompting techniques.', price: null, category: 'Productivity', rating: 4.8, reviews: 124, image: '/playbook-cover-1.jpg' },
  { id: 2, title: 'AI Automation Engine', desc: 'Build powerful automation workflows that save hours every day.', price: 29, category: 'Automation', rating: 4.9, reviews: 89, image: '/playbook-cover-2.jpg' },
  { id: 3, title: 'Prompt Engineering Pro', desc: 'Master the art of prompt engineering for any AI model.', price: null, category: 'Development', rating: 4.7, reviews: 156, image: '/playbook-cover-3.jpg' },
  { id: 4, title: 'No-Code AI Workflows', desc: 'Create AI-powered workflows without writing a single line of code.', price: 49, category: 'No-Code', rating: 4.8, reviews: 67, image: '/playbook-cover-4.jpg' },
  { id: 5, title: 'Data Analysis with AI', desc: 'Transform raw data into actionable insights using AI tools.', price: null, category: 'Data', rating: 4.6, reviews: 93, image: '/playbook-cover-5.jpg' },
  { id: 6, title: 'AI Content System', desc: 'Build a complete content creation pipeline powered by AI.', price: 39, category: 'Marketing', rating: 4.9, reviews: 112, image: '/playbook-cover-6.jpg' },
];

const steps = [
  { icon: Search, title: 'Browse', desc: 'Explore free and premium playbooks across categories.' },
  { icon: MousePointer, title: 'Choose', desc: 'Find the playbook that matches your goal.' },
  { icon: CreditCard, title: 'Get', desc: 'Download free or purchase instantly.' },
  { icon: Rocket, title: 'Execute', desc: 'Open the .html file and start mastering.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Manager', avatar: '/avatar-1.jpg', quote: 'The Automation Engine playbook saved me 15 hours a week. Worth every penny.', rating: 5 },
  { name: 'Marcus Webb', role: 'Developer', avatar: '/avatar-2.jpg', quote: 'Finally, AI content that isn\'t fluff. Dense, actionable, and immediately useful.', rating: 5 },
  { name: 'Priya Nair', role: 'Marketing Lead', avatar: '/avatar-3.jpg', quote: 'The Prompt Engineering Pro is my daily reference. Game changer.', rating: 5 },
  { name: 'James Rodriguez', role: 'Startup Founder', avatar: '/avatar-4.jpg', quote: 'Echo Glitch playbooks are the only AI resources I actually finish and use.', rating: 4 },
  { name: 'Elena Volkov', role: 'Data Scientist', avatar: '/avatar-5.jpg', quote: 'These playbooks cut through the noise. Exactly what I needed.', rating: 5 },
  { name: 'David Kim', role: 'UX Designer', avatar: '/avatar-6.jpg', quote: 'The No-Code AI Workflows transformed how I prototype. Absolutely brilliant.', rating: 5 },
];

/* ──────────────────────────────────────────────
   Toast Component
   ────────────────────────────────────────────── */
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
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-[200] bg-dark-base text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5L7.3 10.7l-1.1 1.1-3.2-3.2 1.1-1.1 2.1 2.1 3.7-3.7 1.1 1.1z" fill="#00BFA6"/></svg>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   RollingText Component
   ────────────────────────────────────────────── */
function RollingText({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-block overflow-hidden"
      style={{ lineHeight: '1.5em', height: '1.5em' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ height: '1.5em', lineHeight: '1.5em', verticalAlign: 'top' }}
        >
          <span
            className="inline-block transition-transform"
            style={{
              transitionDuration: '0.6s',
              transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
              transitionDelay: `${i * 0.015}s`,
              transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
            }}
          >
            <span className="block" style={{ height: '1.5em', lineHeight: '1.5em' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
            <span
              className="block text-gradient"
              style={{ height: '1.5em', lineHeight: '1.5em' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Section: Hero
   ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* WebGL Background */}
      <Suspense fallback={null}>
        <FluidWarpGrid />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass-panel-strong rounded-3xl p-8 sm:p-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block text-xs font-medium tracking-[0.05em] uppercase bg-accent-violet/10 text-accent-violet rounded-full px-4 py-1">
              AI Playbook Ecosystem
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-clash font-bold text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.04em] text-[#1A1A1A] mb-6"
          >
            Cut the Noise.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-[#4A5568] text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Densified AI playbooks for ambitious professionals. No fluff. Just execution.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/marketplace"
              className="bg-accent-violet text-white rounded-full px-10 py-4 font-medium text-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            >
              Browse Playbooks
            </Link>
            <a
              href="#manifesto"
              className="text-[#4A5568] hover:text-accent-violet font-medium transition-colors duration-200 flex items-center gap-1"
            >
              Learn More <span className="text-lg">&darr;</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section: Manifesto
   ────────────────────────────────────────────── */
function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  const paragraphs = [
    "Every day, thousands of AI tutorials are published. Most are outdated before you finish reading.",
    "Echo Glitch playbooks are different. Each one is a self-contained executable system.",
    "No accounts. No subscriptions. Just download, open, and execute.",
  ];

  return (
    <section id="manifesto" className="bg-[#F4F7F9] py-[120px] md:py-[120px]">
      <div ref={ref} className="max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="font-clash font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-[#1A1A1A] mb-12 cursor-default"
        >
          <RollingText text="The Noise Ends Here" />
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-6"
        >
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={staggerItem}
              className="text-[#4A5568] text-[1.125rem] leading-relaxed max-w-[640px] mx-auto"
            >
              {p}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section: The Arsenal
   ────────────────────────────────────────────── */
function ArsenalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section className="bg-[#F4F7F9] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-clash font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-[#1A1A1A]">
              The Arsenal
            </h2>
            <p className="text-[#4A5568] text-lg mt-2">Premium playbooks. Zero friction.</p>
          </div>
          <Link
            to="/marketplace"
            className="text-accent-violet font-medium hover:underline underline-offset-4 transition-all shrink-0"
          >
            View All &rarr;
          </Link>
        </motion.div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1000px' }}
        >
          {playbooks.map((pb, i) => (
            <motion.div
              key={pb.id}
              custom={i}
              variants={cardCascade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="group glass-panel-strong rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-glass-lg cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={pb.image}
                  alt={pb.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  {pb.price === null ? (
                    <span className="bg-accent-teal text-white text-xs font-semibold px-3 py-1 rounded-full">
                      FREE
                    </span>
                  ) : (
                    <span className="bg-accent-violet text-white text-xs font-semibold px-3 py-1 rounded-full">
                      ${pb.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-xs font-medium text-accent-violet uppercase tracking-wider">
                  {pb.category}
                </span>
                <h3 className="font-clash font-semibold text-lg text-[#1A1A1A] mt-1 mb-2 leading-tight">
                  {pb.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed line-clamp-2 mb-4">
                  {pb.desc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${si < Math.floor(pb.rating) ? 'text-accent-amber fill-accent-amber' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-[#A0AEC0] ml-1">({pb.reviews})</span>
                  </div>
                  <span className="text-xs font-medium text-accent-violet group-hover:underline">
                    Get Playbook &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section: How It Works
   ────────────────────────────────────────────── */
function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  return (
    <section className="bg-[#F4F7F9] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-clash font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-[#1A1A1A] text-center mb-16"
        >
          How It Works
        </motion.h2>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-[40px] left-[12.5%] right-[12.5%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="h-full border-t border-dashed border-accent-violet/30 origin-left"
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.2,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="glass-panel-strong rounded-2xl p-6 text-center relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: i * 0.2 + 0.3,
                  }}
                  className="w-16 h-16 rounded-full bg-accent-violet/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Icon className="w-7 h-7 text-accent-violet" />
                </motion.div>
                <h3 className="font-clash font-semibold text-lg text-[#1A1A1A] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section: Testimonials
   ────────────────────────────────────────────── */
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <section
      className="bg-dark-base text-white py-[120px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1280px] mx-auto px-6" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-clash font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-center mb-16"
        >
          Trusted by Professionals
        </motion.h2>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number] }}
                className="flex justify-center"
              >
                <div
                  className="max-w-lg w-full rounded-2xl p-8"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-4 h-4 ${si < testimonials[currentIndex].rating ? 'text-accent-amber fill-accent-amber' : 'text-gray-500'}`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/90 italic text-lg leading-relaxed mb-6">
                    &ldquo;{testimonials[currentIndex].quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-white/50">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center hover:brightness-110 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-accent-violet w-6' : 'bg-white/30'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center hover:brightness-110 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section: Feedback Form
   ────────────────────────────────────────────── */
function FeedbackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Suggestion',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Feedback submitted:', form);
    setToast('Thank you! Your feedback has been received.');
    setForm({ name: '', email: '', category: 'Suggestion', message: '' });
    setErrors({});
  };

  return (
    <section className="bg-[#F4F7F9] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="lg:col-span-2"
          >
            <h2 className="font-clash font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-[#1A1A1A] mb-4">
              Your Voice Matters
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-6">
              Your feedback drives our playbook pipeline. Share suggestions, report issues, or request improvements.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Suggest a Playbook', 'Report a Bug', 'Request a Feature'].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, category: label.includes('Bug') ? 'Issue' : label.includes('Feature') ? 'Improvement' : 'Suggestion' }));
                    document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-accent-violet bg-accent-violet/10 rounded-full px-4 py-2 hover:bg-accent-violet/20 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="lg:col-span-3"
          >
            <form
              id="feedback-form"
              onSubmit={handleSubmit}
              className="glass-panel-strong rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <motion.div variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                {/* Name */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full bg-white/80 border rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 ${errors.name ? 'border-accent-rose' : 'border-gray-200'}`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-accent-rose text-xs mt-1">{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5 mt-5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full bg-white/80 border rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 ${errors.email ? 'border-accent-rose' : 'border-gray-200'}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email}</p>}
                </motion.div>

                {/* Category */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5 mt-5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20"
                  >
                    <option>Suggestion</option>
                    <option>Issue</option>
                    <option>Improvement</option>
                    <option>Contact</option>
                  </select>
                </motion.div>

                {/* Message */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs font-medium text-[#4A5568] uppercase tracking-wider mb-1.5 mt-5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full bg-white/80 border rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 resize-none ${errors.message ? 'border-accent-rose' : 'border-gray-200'}`}
                    placeholder="Tell us what's on your mind..."
                  />
                  {errors.message && <p className="text-accent-rose text-xs mt-1">{errors.message}</p>}
                </motion.div>

                {/* Submit */}
                <motion.div variants={staggerItem} className="pt-2">
                  <button
                    type="submit"
                    className="bg-accent-violet text-white rounded-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.02] flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Home Page
   ────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <ManifestoSection />
      <ArsenalSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FeedbackSection />
    </>
  );
}
