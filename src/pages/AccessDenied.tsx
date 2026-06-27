import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(244, 63, 94, 0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 50% 70%, rgba(108, 99, 255, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass-panel-strong rounded-2xl p-10 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: 'rgba(244, 63, 94, 0.1)' }}
          >
            <ShieldAlert className="w-10 h-10" style={{ color: 'var(--accent-rose)' }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-clash font-bold text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Access Denied
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your account is authenticated but you do not have admin privileges. Access to the dashboard is restricted.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            If you believe this is an error, contact the site owner to request admin access.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ color: 'var(--text-secondary)', background: 'transparent' }}
            >
              Go Home
            </Link>
            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200 hover:scale-[1.02]"
              style={{ borderColor: 'var(--accent-violet)', color: 'var(--accent-violet)' }}
            >
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
