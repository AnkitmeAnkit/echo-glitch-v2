import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, setAdminForDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError.message);
        setIsLoading(false);
        return;
      }
      // Check admin role will be done by route guard
      // For now, if login succeeds without error, we let them through
      setAdminForDemo(true);
      navigate('/admin/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    setAdminForDemo(true);
    navigate('/admin/dashboard');
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(108, 99, 255, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(0, 191, 166, 0.1) 0%, transparent 60%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108, 99, 255, 0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0, 191, 166, 0.15) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass-panel-strong rounded-2xl p-10"
        >
          {/* Logo */}
          <div className="text-center">
            <h1 className="font-clash font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              ECHO GLITCH
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Admin Access</p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t" style={{ borderColor: 'var(--border-glass)' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@echoglitch.com"
                required
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full text-white font-medium text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent-violet)' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Demo Mode */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onClick={handleDemoMode}
            className="w-full py-3 rounded-full font-medium text-sm border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: 'var(--accent-violet)', color: 'var(--accent-violet)' }}
          >
            Demo Mode (No Login)
          </motion.button>

          {/* Back to Home */}
          <div className="text-center mt-5">
            <Link
              to="/"
              className="text-xs font-medium transition-colors duration-200 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
