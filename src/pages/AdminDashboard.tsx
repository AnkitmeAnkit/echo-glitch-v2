import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingCart, FileText, Star, Search,
  Pencil, Trash2, Eye, Plus, X, Download,
  CheckCircle, Clock, DollarSign,
  LogOut, Inbox, Newspaper, ClipboardList,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/AdminSidebar';
import type { AdminView } from '@/components/AdminSidebar';
import StatCard from '@/components/StatCard';
import {
  mockPurchases, mockFeedback, mockCustomRequests,
  mockDailyStats, mockReviews, mockAdminPlaybooks,
  mockBlogPosts, mockNewsPosts, analyticsSummary,
  playbooksByCategory, freeVsPaid,
} from '@/data/adminData';
import type {
  FeedbackEntry, CustomRequest,
  AdminPlaybook, BlogPost, NewsPost,
} from '@/data/adminData';

const viewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard Overview',
  playbooks: 'Playbooks Management',
  blog: 'Blog Posts',
  news: 'News Posts',
  purchases: 'Purchases',
  reviews: 'Reviews',
  forms: 'Forms',
  analytics: 'Analytics',
  settings: 'Settings',
};

/* ──────────────────── Dashboard Overview ──────────────────── */
function DashboardOverview() {
  const recentPurchases = mockPurchases.slice(0, 5);
  const recentFeedback = mockFeedback.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Total Playbooks" value={analyticsSummary.totalPlaybooks} icon={<BookOpen className="w-5 h-5" />} iconColor="#6C63FF" trend="+3 this month" delay={0} />
        <StatCard title="Total Purchases" value={analyticsSummary.totalPurchases} icon={<ShoppingCart className="w-5 h-5" />} iconColor="#00BFA6" trend="+12% this week" delay={0.08} />
        <StatCard title="Total Blog Posts" value={mockBlogPosts.length} icon={<FileText className="w-5 h-5" />} iconColor="#F59E0B" delay={0.16} />
        <StatCard title="Total Revenue" value={`$${analyticsSummary.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} iconColor="#F43F5E" trend="+8% this month" delay={0.24} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-clash font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Recent Purchases</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>Playbook</th>
                  <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>Customer</th>
                  <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>{p.playbookTitle}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.customerName}</td>
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${p.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'Completed' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                        {p.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-clash font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Latest Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentFeedback.map((f) => (
              <div key={f.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] font-medium">{f.category}</span>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{f.message}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{f.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-white rounded-xl border border-gray-200 p-5"
      >
        <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Weekly Purchases</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mockDailyStats.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} stroke="#A0AEC0" fontSize={12} />
            <YAxis stroke="#A0AEC0" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="purchases" stroke="#6C63FF" strokeWidth={2} dot={{ r: 3, fill: '#6C63FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

/* ──────────────────── Playbooks Management ──────────────────── */
function PlaybooksManagement() {
  const [items, setItems] = useState<AdminPlaybook[]>(mockAdminPlaybooks);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminPlaybook | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({
      id: Date.now(), title: '', description: '', category: 'AI Automation',
      price: 0, status: 'Draft', downloads: 0, coverImage: '', fileUrl: '', rating: 0, reviewCount: 0,
    });
    setShowModal(true);
  };

  const openEdit = (p: AdminPlaybook) => {
    setEditing({ ...p });
    setShowModal(true);
  };

  const savePlaybook = () => {
    if (!editing) return;
    setItems((prev) => {
      const exists = prev.find((p) => p.id === editing.id);
      if (exists) return prev.map((p) => (p.id === editing.id ? editing : p));
      return [...prev, editing];
    });
    setShowModal(false);
    setEditing(null);
  };

  const deletePlaybook = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search playbooks..."
            className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 w-64"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background: 'var(--accent-violet)' }}
        >
          <Plus className="w-4 h-4" /> Add Playbook
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Title', 'Category', 'Price', 'Status', 'Downloads', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td className="py-3 px-4 text-sm font-medium">{p.price === 0 ? <span className="text-[#00BFA6]">Free</span> : <span style={{ color: 'var(--text-primary)' }}>${p.price}</span>}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'Published' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{p.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.downloads.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(String(p.id))} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: 'var(--accent-rose)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No playbooks found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.title ? 'Edit Playbook' : 'Add Playbook'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
                  <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      {['AI Automation', 'Prompt Engineering', 'Workflow', 'Business', 'Creative'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Price ($)</label>
                    <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'Published' | 'Draft' })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cover Image URL</label>
                    <input value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="/playbook-cover-X.jpg" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>File URL</label>
                  <input value={editing.fileUrl} onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={savePlaybook} className="px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:brightness-110" style={{ background: 'var(--accent-violet)' }}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Delete Playbook</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Are you sure? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button onClick={() => deletePlaybook(Number(deleteConfirm))} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: 'var(--accent-rose)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── Blog Management ──────────────────── */
function BlogManagement() {
  const [items, setItems] = useState<BlogPost[]>(mockBlogPosts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({ id: String(Date.now()), title: '', slug: '', category: 'AI Trends', author: 'Admin', excerpt: '', content: '', status: 'Draft', date: new Date().toISOString().split('T')[0], featured: false });
    setShowPreview(false);
    setShowModal(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditing({ ...b });
    setShowPreview(false);
    setShowModal(true);
  };

  const saveBlog = () => {
    if (!editing) return;
    setItems((prev) => {
      const exists = prev.find((b) => b.id === editing.id);
      if (exists) return prev.map((b) => (b.id === editing.id ? editing : b));
      return [...prev, editing];
    });
    setShowModal(false);
    setEditing(null);
  };

  const deleteBlog = (id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blog posts..." className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 w-64" />
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium hover:brightness-110 transition-all" style={{ background: 'var(--accent-violet)' }}><Plus className="w-4 h-4" /> Add Post</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{b.title}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.category}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.author}</td>
                  <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${b.status === 'Published' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{b.status}</span></td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{b.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteBlog(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: 'var(--accent-rose)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No blog posts found</p>
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.title ? 'Edit Post' : 'New Blog Post'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Slug</label>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      {['AI Trends', 'Prompt Engineering', 'Tutorial', 'Creative', 'Business'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Author</label>
                    <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Excerpt</label>
                  <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'Published' | 'Draft' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
                    <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowPreview(false)} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${!showPreview ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'text-gray-500 hover:bg-gray-100'}`}>Editor</button>
                  <button onClick={() => setShowPreview(true)} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${showPreview ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'text-gray-500 hover:bg-gray-100'}`}>Preview</button>
                </div>
                {!showPreview ? (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content (Markdown)</label>
                    <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 font-mono" placeholder="# Write your content in markdown..." />
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 min-h-[200px] bg-gray-50 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {editing.content ? (
                        <div className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-primary)' }}>{editing.content}</div>
                      ) : (
                        <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>Nothing to preview yet...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button onClick={saveBlog} className="px-5 py-2.5 rounded-full text-white text-sm font-medium hover:brightness-110 transition-all" style={{ background: 'var(--accent-violet)' }}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── News Management ──────────────────── */
function NewsManagement() {
  const [items, setItems] = useState<NewsPost[]>(mockNewsPosts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsPost | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({ id: String(Date.now()), title: '', slug: '', category: 'Announcement', author: 'Echo Team', excerpt: '', content: '', status: 'Draft', date: new Date().toISOString().split('T')[0], featured: false });
    setShowModal(true);
  };

  const saveNews = () => {
    if (!editing) return;
    setItems((prev) => {
      const exists = prev.find((n) => n.id === editing.id);
      if (exists) return prev.map((n) => (n.id === editing.id ? editing : n));
      return [...prev, editing];
    });
    setShowModal(false);
    setEditing(null);
  };

  const deleteNews = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news posts..." className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 w-64" />
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium hover:brightness-110 transition-all" style={{ background: 'var(--accent-violet)' }}><Plus className="w-4 h-4" /> Add News</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{n.title}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{n.category}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{n.author}</td>
                  <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${n.status === 'Published' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{n.status}</span></td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{n.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing({ ...n }); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteNews(n.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: 'var(--accent-rose)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Newspaper className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No news posts found</p>
          </div>
        )}
      </div>

      {/* News Editor Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.title ? 'Edit News' : 'New News Post'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as 'Product Update' | 'Industry' | 'Announcement' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="Product Update">Product Update</option>
                      <option value="Industry">Industry</option>
                      <option value="Announcement">Announcement</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'Published' | 'Draft' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
                    <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
                  <label htmlFor="featured" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured on homepage</label>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Excerpt</label>
                  <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content (Markdown)</label>
                  <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 font-mono" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button onClick={saveNews} className="px-5 py-2.5 rounded-full text-white text-sm font-medium hover:brightness-110 transition-all" style={{ background: 'var(--accent-violet)' }}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── Purchases View ──────────────────── */
function PurchasesView() {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() =>
    mockPurchases.filter((p) =>
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.playbookTitle.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or playbook..." className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 w-80" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Customer', 'Email', 'Profession', 'Playbook', 'Amount', 'Date', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.customerName}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.email}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.profession}</td>
                  <td className="py-3 px-4 text-sm truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>{p.playbookTitle}</td>
                  <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${p.amount}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{p.date}</td>
                  <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'Completed' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No purchases found</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────── Reviews View ──────────────────── */
function ReviewsView() {
  const [filterPlaybook, setFilterPlaybook] = useState('All');
  const playbookNames = useMemo(() => ['All', ...Array.from(new Set(mockReviews.map((r) => r.playbookTitle)))], []);

  const filtered = useMemo(() =>
    filterPlaybook === 'All' ? mockReviews : mockReviews.filter((r) => r.playbookTitle === filterPlaybook),
    [filterPlaybook]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter by playbook:</span>
        <select value={filterPlaybook} onChange={(e) => setFilterPlaybook(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
          {playbookNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00BFA6] flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {r.userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.userName}</h4>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.date}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{r.playbookTitle}</p>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                <div className="mt-2">
                  <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${r.approved ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                    {r.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
          <Star className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No reviews found</p>
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Forms View ──────────────────── */
function FormsView() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'requests'>('feedback');
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(mockFeedback);
  const [requestsList] = useState<CustomRequest[]>(mockCustomRequests);
  const [search, setSearch] = useState('');

  const filteredFeedback = useMemo(() =>
    feedbackList.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
    ),
    [feedbackList, search]
  );

  const filteredRequests = useMemo(() =>
    requestsList.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    ),
    [requestsList, search]
  );

  const updateFeedbackStatus = (id: string, status: 'New' | 'In Progress' | 'Resolved') => {
    setFeedbackList((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit">
        <button onClick={() => setActiveTab('feedback')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'feedback' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`} style={activeTab === 'feedback' ? { background: 'var(--accent-violet)' } : {}}>Feedback</button>
        <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'requests' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`} style={activeTab === 'requests' ? { background: 'var(--accent-violet)' } : {}}>Custom Requests</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeTab}...`} className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 w-80" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'feedback' ? (
          <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Name', 'Email', 'Category', 'Message', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFeedback.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.name}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{f.email}</td>
                      <td className="py-3 px-4"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">{f.category}</span></td>
                      <td className="py-3 px-4 text-sm truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{f.message}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{f.date}</td>
                      <td className="py-3 px-4">
                        <select value={f.status} onChange={(e) => updateFeedbackStatus(f.id, e.target.value as 'New' | 'In Progress' | 'Resolved')} className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none">
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Eye className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFeedback.length === 0 && (
              <div className="py-12 text-center">
                <Inbox className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No feedback entries found</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Name', 'Email', 'Topic', 'Budget', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.email}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.topic}</td>
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.budget || '-'}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                          r.status === 'New' ? 'bg-[#F43F5E]/10 text-[#F43F5E]' :
                          r.status === 'Contacted' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          r.status === 'In Progress' ? 'bg-[#6C63FF]/10 text-[#6C63FF]' :
                          r.status === 'Completed' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' :
                          'bg-gray-100 text-gray-500'
                        }`}>{r.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Eye className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="py-12 text-center">
                <ClipboardList className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No custom requests found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── Analytics View ──────────────────── */
function AnalyticsView() {
  return (
    <div className="space-y-5">
      {/* Row 1: Line + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Purchases Over Time (30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockDailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} stroke="#A0AEC0" fontSize={11} />
              <YAxis stroke="#A0AEC0" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="purchases" stroke="#6C63FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Playbooks by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={playbooksByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#A0AEC0" fontSize={11} />
              <YAxis stroke="#A0AEC0" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#6C63FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2: Area + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Website Visits</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockDailyStats}>
              <defs>
                <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00BFA6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} stroke="#A0AEC0" fontSize={11} />
              <YAxis stroke="#A0AEC0" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="visits" stroke="#00BFA6" fill="url(#visitsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Free vs Paid Downloads</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={freeVsPaid} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {freeVsPaid.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Revenue */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Revenue Over Time (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockDailyStats}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} stroke="#A0AEC0" fontSize={11} />
            <YAxis stroke="#A0AEC0" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="revenue" stroke="#6C63FF" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

/* ──────────────────── Settings View ──────────────────── */
function SettingsView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-xl space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-clash font-semibold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00BFA6] flex items-center justify-center text-white font-clash font-bold text-xl">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email || 'admin@echoglitch.com'}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Role</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">Admin</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span className="flex items-center gap-1 text-xs font-medium text-[#00BFA6]"><span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6]" /> Active</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-clash font-semibold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Preferences</h3>
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>Theme</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>System default (coming soon)</span>
          </div>
          <div className="w-10 h-6 rounded-full bg-gray-200 cursor-not-allowed opacity-50" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-clash font-semibold text-lg mb-4" style={{ color: 'var(--accent-rose)' }}>Danger Zone</h3>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium hover:brightness-110 transition-all" style={{ background: 'var(--accent-rose)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </motion.div>
    </div>
  );
}

/* ──────────────────── Main Admin Dashboard ──────────────────── */
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardOverview />;
      case 'playbooks': return <PlaybooksManagement />;
      case 'blog': return <BlogManagement />;
      case 'news': return <NewsManagement />;
      case 'purchases': return <PurchasesView />;
      case 'reviews': return <ReviewsView />;
      case 'forms': return <FormsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main content */}
      <div className="lg:ml-[260px] min-h-[100dvh]">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 lg:px-8 sticky top-0 z-40">
          <h2 className="font-clash font-semibold text-lg lg:text-xl" style={{ color: 'var(--text-primary)' }}>
            {viewTitles[activeView]}
          </h2>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}


