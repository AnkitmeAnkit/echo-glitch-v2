import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Playbooks', href: '/marketplace' },
  { label: 'Blog', href: '/blog' },
  { label: 'News', href: '/news' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={
          'sticky top-0 z-50 h-[72px] flex items-center transition-all duration-300 border-b border-transparent ' +
          (scrolled ? 'shadow-sm' : '')
        }
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottomColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="max-w-[1280px] mx-auto w-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/echo-glitch-logo.svg" alt="Echo Glitch" className="h-7" />
          </Link>

          {/* Center Nav Links — Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={
                  'text-[1rem] font-medium tracking-[0.02em] transition-colors duration-200 hover:text-accent-violet ' +
                  (location.pathname === link.href ? 'text-accent-violet' : 'text-[#1A1A1A]')
                }
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/marketplace"
              className="bg-accent-violet text-white rounded-full px-6 py-2.5 font-medium text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            >
              Browse Playbooks
            </Link>

          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between px-6 h-[72px] shrink-0">
              <img src="/echo-glitch-logo.svg" alt="Echo Glitch" className="h-7" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-[#1A1A1A]" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  <Link
                    to={link.href}
                    className="text-3xl font-clash font-semibold text-[#1A1A1A] hover:text-accent-violet transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <Link
                  to="/marketplace"
                  className="bg-accent-violet text-white rounded-full px-8 py-3 font-medium text-lg transition-all hover:brightness-110"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Playbooks
                </Link>
              </motion.div>


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
