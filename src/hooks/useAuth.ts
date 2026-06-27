import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
        };
        setUser(u);
        checkAdminRole(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
        };
        setUser(u);
        checkAdminRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    // Mock: check from user_roles table or metadata
    // In production: const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
    // For now, use a localStorage flag for demo
    const adminFlag = localStorage.getItem('echo_glitch_admin');
    setIsAdmin(adminFlag === 'true');
    void userId;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('echo_glitch_admin');
    setUser(null);
    setIsAdmin(false);
  };

  const setAdminForDemo = useCallback((value: boolean) => {
    localStorage.setItem('echo_glitch_admin', String(value));
    setIsAdmin(value);
  }, []);

  return { user, isLoading, isAdmin, login, logout, setAdminForDemo };
}
