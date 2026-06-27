import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import PlaybookDetail from './pages/PlaybookDetail';
import Blog from './pages/Blog';
import News from './pages/News';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AccessDenied from './pages/AccessDenied';
import AdminRouteGuard from './components/AdminRouteGuard';

function App() {
  return (
    <Routes>
      {/* Public pages with Layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/playbook/:id" element={<PlaybookDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/news" element={<News />} />
      </Route>

      {/* Admin routes - no Layout, standalone pages */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/denied" element={<AccessDenied />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRouteGuard>
            <AdminDashboard />
          </AdminRouteGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
