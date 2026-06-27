import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Newspaper,
  ShoppingCart,
  Star,
  Inbox,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export type AdminView =
  | 'dashboard'
  | 'playbooks'
  | 'blog'
  | 'news'
  | 'purchases'
  | 'reviews'
  | 'forms'
  | 'analytics'
  | 'settings';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const navItems: { key: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'playbooks', label: 'Playbooks', icon: BookOpen },
  { key: 'blog', label: 'Blog Posts', icon: FileText },
  { key: 'news', label: 'News Posts', icon: Newspaper },
  { key: 'purchases', label: 'Purchases', icon: ShoppingCart },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'forms', label: 'Forms', icon: Inbox },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00BFA6] flex items-center justify-center">
          <span className="text-white font-clash font-bold text-sm">E</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-clash font-semibold text-sm tracking-tight">ECHO GLITCH</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeView === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => {
                onViewChange(item.key);
                setMobileOpen(false);
              }}
              className={
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 " +
                (isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5")
              }
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-0.5 h-6 rounded-full"
                  style={{ background: '#6C63FF' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00BFA6] flex items-center justify-center text-white font-medium text-xs">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">{user?.email || 'admin@echoglitch.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: 'var(--dark-base)', color: 'white' }}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] z-[56] flex flex-col"
            style={{ background: 'var(--dark-base)' }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] flex-col z-50"
        style={{ background: 'var(--dark-base)' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
