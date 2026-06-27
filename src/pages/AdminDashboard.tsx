import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingCart, FileText, Star, Search,
  Pencil, Trash2, Eye, Plus, X, Download,
  CheckCircle, Clock, DollarSign, RefreshCw,
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
import { supabase } from '@/lib/supabase';
import type {
  AdminPlaybook, BlogPost, NewsPost,
  Category
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
  const [stats, setStats] = useState({ totalPlaybooks: 0, totalPurchases: 0, totalBlogPosts: 0, totalRevenue: 0 });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const [playbooksRes, purchasesRes, blogRes, feedbackRes] = await Promise.all([
        supabase.from('playbooks').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, amount, status, created_at, full_name, playbooks(title)').order('created_at', { ascending: false }).limit(5),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('id, name, type, message_or_requirements, created_at, status').order('created_at', { ascending: false }).limit(5),
      ]);

      // Total revenue from all completed orders
      const { data: revenueData } = await supabase.from('orders').select('amount').eq('status', 'PAID');
      const totalRevenue = revenueData?.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) || 0;

      setStats({
        totalPlaybooks: playbooksRes.count || 0,
        totalPurchases: purchasesRes.data?.length || 0,
        totalBlogPosts: blogRes.count || 0,
        totalRevenue,
      });
      setRecentPurchases(purchasesRes.data || []);
      setRecentFeedback(feedbackRes.data || []);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Total Playbooks" value={stats.totalPlaybooks} icon={<BookOpen className="w-5 h-5" />} iconColor="#6C63FF" delay={0} />
        <StatCard title="Total Purchases" value={stats.totalPurchases} icon={<ShoppingCart className="w-5 h-5" />} iconColor="#00BFA6" delay={0.08} />
        <StatCard title="Total Blog Posts" value={stats.totalBlogPosts} icon={<FileText className="w-5 h-5" />} iconColor="#F59E0B" delay={0.16} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} iconColor="#F43F5E" delay={0.24} />
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
                    <td className="py-3 px-4 text-sm font-medium truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>{p.playbooks?.title || '-'}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.full_name}</td>
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${p.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'PAID' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                        {p.status === 'PAID' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
            <h3 className="font-clash font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Latest Form Submissions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentFeedback.map((f) => (
              <div key={f.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] font-medium">{f.type === 'FEEDBACK' ? 'Feedback' : 'Request'}</span>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{f.message_or_requirements}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{f.created_at ? new Date(f.created_at).toLocaleDateString() : '-'}</p>
              </div>
            ))}
            {recentFeedback.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-gray-500">No recent submissions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────── Playbooks Management ──────────────────── */
function PlaybooksManagement() {
  const [items, setItems] = useState<AdminPlaybook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<AdminPlaybook> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [playbooksRes, catsRes] = await Promise.all([
      supabase.from('playbooks').select('*, categories(name, slug)').is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('type', 'PLAYBOOK')
    ]);
    if (playbooksRes.data) setItems(playbooksRes.data as any);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({
      title: '', description: '', category_id: categories[0]?.id || '',
      price: 0, status: 'DRAFT', is_featured: false, cover_image_url: '', file_path: '', slug: ''
    });
    setShowModal(true);
  };

  const openEdit = (p: AdminPlaybook) => {
    setEditing({ ...p });
    setShowModal(true);
  };

  const savePlaybook = async () => {
    if (!editing) return;
    
    // Auto-generate slug if empty
    if (!editing.slug && editing.title) {
      editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    try {
      if (editing.id) {
        // Update
        const { id, categories: _c, playbook_reviews: _r, ...updateData } = editing as any;
        await supabase.from('playbooks').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        // Insert
        await supabase.from('playbooks').insert(editing as any);
      }
      setShowModal(false);
      setEditing(null);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error saving playbook:', err);
      alert('Error saving playbook. Make sure the slug is unique.');
    }
  };

  const deletePlaybook = async (id: string) => {
    try {
      await supabase.from('playbooks').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting playbook:', err);
    }
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
        {loading ? (
          <div className="p-8 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Title', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.categories?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium">{p.price === 0 ? <span className="text-[#00BFA6]">Free</span> : <span style={{ color: 'var(--text-primary)' }}>${p.price}</span>}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'PUBLISHED' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{p.status}</span>
                    </td>
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
        )}
        {!loading && filtered.length === 0 && (
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
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.id ? 'Edit Playbook' : 'Add Playbook'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Slug</label>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="Auto-generated if empty" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
                  <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {categories.length === 0 && <option value="">No categories found</option>}
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
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" id="featuredPlaybook" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} className="rounded" />
                    <label htmlFor="featuredPlaybook" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured Playbook</label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cover Image URL (or upload to public_assets bucket)</label>
                    <input value={editing.cover_image_url} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>File Path (storage path)</label>
                    <input value={editing.file_path} onChange={(e) => setEditing({ ...editing, file_path: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
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
                <button onClick={() => deletePlaybook(deleteConfirm)} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: 'var(--accent-rose)' }}>Delete</button>
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
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [blogsRes, catsRes] = await Promise.all([
      supabase.from('blog_posts').select('*, categories(name, slug), users(full_name, avatar_url)').is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('type', 'BLOG')
    ]);
    if (blogsRes.data) setItems(blogsRes.data as any);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({
      title: '', slug: '', category_id: categories[0]?.id || '',
      excerpt: '', content: '', status: 'DRAFT', is_featured: false,
      published_at: new Date().toISOString().split('T')[0],
      cover_image_url: ''
    });
    setShowPreview(false);
    setShowModal(true);
  };

  const openEdit = (b: BlogPost) => {
    setEditing({ ...b });
    setShowPreview(false);
    setShowModal(true);
  };

  const saveBlog = async () => {
    if (!editing) return;
    
    if (!editing.slug && editing.title) {
      editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    try {
      // If creating new, we need an author_id. Let's get the current user.
      const { data: { user } } = await supabase.auth.getUser();
      const author_id = user?.id;

      if (editing.id) {
        // Update
        const { id, categories: _c, users: _u, ...updateData } = editing as any;
        await supabase.from('blog_posts').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        // Insert
        await supabase.from('blog_posts').insert({ ...editing, author_id } as any);
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error('Error saving blog post:', err);
      alert('Error saving post. Slug must be unique.');
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await supabase.from('blog_posts').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting blog post:', err);
    }
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
        {loading ? (
          <div className="p-8 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" /></div>
        ) : (
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
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.categories?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.users?.full_name || 'Admin'}</td>
                    <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${b.status === 'PUBLISHED' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{b.status}</span></td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{b.published_at ? new Date(b.published_at).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm(String(b.id))} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: 'var(--accent-rose)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No blog posts found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Delete Blog Post</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Are you sure? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button onClick={() => deleteBlog(deleteConfirm)} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: 'var(--accent-rose)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.id ? 'Edit Post' : 'New Blog Post'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Slug</label>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="Auto-generated if empty" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {categories.length === 0 && <option value="">No categories found</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cover Image URL</label>
                    <input value={editing.cover_image_url} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Excerpt</label>
                  <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Published Date</label>
                    <input type="date" value={editing.published_at ? editing.published_at.split('T')[0] : ''} onChange={(e) => setEditing({ ...editing, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
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
  const [items, setItems] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [newsRes, catsRes] = await Promise.all([
      supabase.from('news_posts').select('*, categories(name, slug), users(full_name, avatar_url)').is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('type', 'NEWS')
    ]);
    if (newsRes.data) setItems(newsRes.data as any);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openCreate = () => {
    setEditing({
      title: '', slug: '', category_id: categories[0]?.id || '',
      excerpt: '', content: '', status: 'DRAFT', timeline_date: new Date().toISOString().split('T')[0],
      published_at: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const saveNews = async () => {
    if (!editing) return;

    if (!editing.slug && editing.title) {
      editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const author_id = user?.id;

      if (editing.id) {
        // Update
        const { id, categories: _c, users: _u, ...updateData } = editing as any;
        await supabase.from('news_posts').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        // Insert
        await supabase.from('news_posts').insert({ ...editing, author_id } as any);
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error('Error saving news post:', err);
      alert('Error saving post. Slug must be unique.');
    }
  };

  const deleteNews = async (id: string) => {
    try {
      await supabase.from('news_posts').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting news post:', err);
    }
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
        {loading ? (
          <div className="p-8 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" /></div>
        ) : (
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
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{n.categories?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{n.users?.full_name || 'Admin'}</td>
                    <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${n.status === 'PUBLISHED' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{n.status}</span></td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{n.published_at ? new Date(n.published_at).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing({ ...n }); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm(String(n.id))} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: 'var(--accent-rose)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center">
            <Newspaper className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No news posts found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Delete News Post</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Are you sure? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button onClick={() => deleteNews(deleteConfirm)} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: 'var(--accent-rose)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* News Editor Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{editing.id ? 'Edit News' : 'New News Post'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Slug</label>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" placeholder="Auto-generated if empty" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {categories.length === 0 && <option value="">No categories found</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Timeline Date</label>
                    <input type="date" value={editing.timeline_date ? editing.timeline_date.split('T')[0] : ''} onChange={(e) => setEditing({ ...editing, timeline_date: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Published Date</label>
                    <input type="date" value={editing.published_at ? editing.published_at.split('T')[0] : ''} onChange={(e) => setEditing({ ...editing, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20" />
                  </div>
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
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*, playbooks(title)').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const filtered = useMemo(() =>
    items.filter((p) =>
      (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.playbooks?.title || '').toLowerCase().includes(search.toLowerCase())
    ),
    [items, search]
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
        {loading ? (
          <div className="p-8 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Customer', 'Email', 'Stripe ID', 'Playbook', 'Amount', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.full_name}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.email}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.stripe_session_id?.substring(0, 10)}...</td>
                    <td className="py-3 px-4 text-sm truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>{p.playbooks?.title || '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${p.amount}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4"><span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'PAID' ? 'bg-[#00BFA6]/10 text-[#00BFA6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No purchases found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const mockReviews = [
  {
    id: '1',
    userName: 'John Doe',
    date: '2023-10-15',
    playbookTitle: 'Complete Trading Guide',
    rating: 5,
    comment: 'Excellent playbook, very detailed and helpful!',
    approved: true
  },
  {
    id: '2',
    userName: 'Jane Smith',
    date: '2023-10-18',
    playbookTitle: 'Complete Trading Guide',
    rating: 4,
    comment: 'Good content, but could use more examples.',
    approved: false
  },
  {
    id: '3',
    userName: 'Alice Johnson',
    date: '2023-10-20',
    playbookTitle: 'Advanced Options Strategies',
    rating: 5,
    comment: 'This changed my trading game completely.',
    approved: true
  }
];

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
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase.from('form_submissions').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const feedbackList = items.filter(i => i.type === 'FEEDBACK');
  const requestsList = items.filter(i => i.type === 'CUSTOM_REQUEST');

  const filteredFeedback = useMemo(() =>
    feedbackList.filter((f) =>
      (f.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.email || '').toLowerCase().includes(search.toLowerCase())
    ),
    [feedbackList, search]
  );

  const filteredRequests = useMemo(() =>
    requestsList.filter((r) =>
      (r.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(search.toLowerCase())
    ),
    [requestsList, search]
  );

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('form_submissions').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    fetchData();
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
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-gray-200 p-8 flex justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" />
          </motion.div>
        ) : activeTab === 'feedback' ? (
          <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Name', 'Email', 'Message', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFeedback.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.full_name || 'Anonymous'}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{f.email}</td>
                      <td className="py-3 px-4 text-sm truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{f.message}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(f.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <select value={f.status} onChange={(e) => updateStatus(f.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none">
                          <option value="NEW">New</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="RESOLVED">Resolved</option>
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
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.full_name}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.email}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.topic || '-'}</td>
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.budget ? `$${r.budget}` : '-'}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none">
                          <option value="NEW">New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="COMPLETED">Completed</option>
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
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [playbooksByCategory, setPlaybooksByCategory] = useState<any[]>([]);
  const [freeVsPaid, setFreeVsPaid] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);

      const [ordersRes, playbooksRes, categoriesRes] = await Promise.all([
        supabase.from('orders').select('amount, created_at, status, playbooks(price, category_id)').eq('status', 'PAID'),
        supabase.from('playbooks').select('id, price, category_id'),
        supabase.from('categories').select('id, name')
      ]);

      const orders = ordersRes.data || [];
      const playbooks = playbooksRes.data || [];
      const categories = categoriesRes.data || [];

      // 1. Daily Stats (Last 30 Days)
      const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
      });

      const statsMap = last30Days.reduce((acc, date) => {
        acc[date] = { date, purchases: 0, revenue: 0, visits: Math.floor(Math.random() * 100) + 50 }; // visits mocked as we lack page_views table
        return acc;
      }, {} as any);

      orders.forEach((o) => {
        const date = new Date(o.created_at).toISOString().split('T')[0];
        if (statsMap[date]) {
          statsMap[date].purchases += 1;
          statsMap[date].revenue += o.amount || 0;
        }
      });

      setDailyStats(Object.values(statsMap));

      // 2. Playbooks by Category
      const catMap = categories.reduce((acc: any, c: any) => {
        acc[c.id] = c.name;
        return acc;
      }, {});

      const pbByCat: Record<string, number> = {};
      playbooks.forEach((pb) => {
        const catName = pb.category_id && catMap[pb.category_id] ? catMap[pb.category_id] : 'Uncategorized';
        pbByCat[catName] = (pbByCat[catName] || 0) + 1;
      });

      setPlaybooksByCategory(Object.entries(pbByCat).map(([category, count]) => ({ category, count })));

      // 3. Free vs Paid Downloads
      let freeCount = 0;
      let paidCount = 0;
      orders.forEach((o: any) => {
        const price = o.playbooks?.price || 0;
        if (price === 0) freeCount++;
        else paidCount++;
      });

      setFreeVsPaid([
        { name: 'Paid', value: paidCount, color: '#6C63FF' },
        { name: 'Free', value: freeCount, color: '#00BFA6' }
      ]);

      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-[#6C63FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Row 1: Line + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Purchases Over Time (30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyStats}>
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
            <AreaChart data={dailyStats}>
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
          <AreaChart data={dailyStats}>
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


