import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  impersonatedWorkspaceId: string | null;
  setImpersonatedWorkspaceId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [impersonatedWorkspaceId, setImpersonatedWorkspaceId] = useState<string | null>(
    localStorage.getItem('impersonatedWorkspaceId')
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSuperAdmin(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSuperAdmin(session.user.id);
      } else {
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSuperAdmin = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const authorizedEmails = ['taliye@kafiskey.com', 'admin@kafiskey.com', 'absame@lazimkey.com'];

      if (user?.email && authorizedEmails.includes(user.email)) {
        setIsSuperAdmin(true);
        return;
      }

      const { data, error } = await supabase
        .from('system_admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (data && !error) {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    } catch (err) {
      console.error('Error checking super admin status:', err);
      setIsSuperAdmin(false);
    }
  };

  const updateImpersonation = (id: string | null) => {
    setImpersonatedWorkspaceId(id);
    if (id) {
      localStorage.setItem('impersonatedWorkspaceId', id);
    } else {
      localStorage.removeItem('impersonatedWorkspaceId');
    }
  };

  const signOut = async () => {
    localStorage.removeItem('impersonatedWorkspaceId');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signOut,
      isSuperAdmin,
      impersonatedWorkspaceId,
      setImpersonatedWorkspaceId: updateImpersonation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
