import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  plan_status: string | null;
  plan_key: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  trial_start_date: string | null;
  access_state: 'TRIAL_ACTIVE' | 'TRIAL_EXPIRED_LOCKED' | 'ACTIVE_PAID' | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  slug: string | null;
  is_check_in_enabled: boolean;
  email_sender_name: string | null;
  email_sender_address: string | null;
  email_reply_to: string | null;
  resend_api_key: string | null;
  is_launchpad: boolean;
  hipaa_config?: {
    enabled: boolean;
    phi_scope: string[];
    role_permissions: Record<string, any>;
    restrictions: string[];
  } | null;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'READ_ONLY';
  status: string;
  full_name?: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeMember: WorkspaceMember | null;
  setActiveWorkspaceId: (id: string) => void;
  refreshWorkspaces: () => Promise<void>;
  loading: boolean;
  isLocked: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number | null;
  isLaunchpad: boolean;
  clientCount: number;
  userCount: number;
  canAddClient: boolean;
  canAddUser: boolean;
  hasBillingAccess: boolean;
  hasAdvancedReporting: boolean;
  planLimits: {
    maxClients: number;
    maxUsers: number;
  };
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading, impersonatedWorkspaceId, isSuperAdmin } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeMember, setActiveMember] = useState<WorkspaceMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);
  const lastActivityUpdateRef = useRef(0);

  useEffect(() => {
    if (!activeWorkspace || impersonatedWorkspaceId) return;
    const now = Date.now();
    if (now - lastActivityUpdateRef.current < 5 * 60 * 1000) return;

    const updateActivity = async () => {
      try {
        await supabase
          .from('workspaces')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', activeWorkspace.id);
        lastActivityUpdateRef.current = now;
      } catch (err) {
        console.error('Error updating workspace activity:', err);
      }
    };
    updateActivity();
  }, [activeWorkspace, impersonatedWorkspaceId]);

  const isTrialActive = (!!activeWorkspace &&
    (activeWorkspace.plan_status === 'trialing' ||
      activeWorkspace.plan_status === 'trial' ||
      activeWorkspace.access_state === 'TRIAL_ACTIVE') &&
    !isLocked) || isSuperAdmin;

  const isLaunchpad = activeWorkspace?.is_launchpad || false;

  const [clientCount, setClientCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if (!activeWorkspace) {
      setClientCount(0);
      setUserCount(0);
      return;
    }

    const fetchCounts = async () => {
      const [clientsRes, usersRes] = await Promise.all([
        supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', activeWorkspace.id)
          .eq('status', 'active'),
        supabase
          .from('workspace_members')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', activeWorkspace.id)
          .eq('status', 'active')
      ]);
      setClientCount(clientsRes.count || 0);
      setUserCount(usersRes.count || 0);
    };
    fetchCounts();
  }, [activeWorkspace]);

  const planKey = isTrialActive ? 'scale' : (activeWorkspace?.plan_key || 'community');

  const planLimits = {
    maxClients: planKey === 'community' ? 3 : Infinity,
    maxUsers: planKey === 'community' ? 1 : (planKey === 'growth' ? 10 : Infinity)
  };

  const canAddClient = clientCount < planLimits.maxClients;
  const canAddUser = userCount < planLimits.maxUsers;
  const hasBillingAccess = planKey !== 'community' || isTrialActive;
  const hasAdvancedReporting = planKey === 'scale' || isTrialActive;

  useEffect(() => {
    if (!activeWorkspace) {
      setIsLocked(false);
      setTrialDaysRemaining(null);
      return;
    }

    const checkLock = async () => {
      if (activeWorkspace.plan_status === 'active' || activeWorkspace.access_state === 'ACTIVE_PAID' || isSuperAdmin) {
        if (isLocked) setIsLocked(false);
        setTrialDaysRemaining(null);
        return;
      }

      const trialStartDate = activeWorkspace.trial_start_date ? new Date(activeWorkspace.trial_start_date) : null;
      const trialEndsAt = activeWorkspace.trial_ends_at ? new Date(activeWorkspace.trial_ends_at) : null;
      const now = new Date();

      if (trialStartDate) {
        const diffTime = now.getTime() - trialStartDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 30 - diffDays);
        setTrialDaysRemaining(remaining);

        if (remaining <= 0 && activeWorkspace.plan_status !== 'active') {
          if (activeWorkspace.access_state !== 'TRIAL_EXPIRED_LOCKED') {
            await supabase
              .from('workspaces')
              .update({ access_state: 'TRIAL_EXPIRED_LOCKED' })
              .eq('id', activeWorkspace.id);
            setActiveWorkspace(prev => prev ? { ...prev, access_state: 'TRIAL_EXPIRED_LOCKED' } : null);
          }
          setIsLocked(true);
        } else {
          if (isLocked) setIsLocked(false);
        }
      } else if (trialEndsAt) {
        const diffTime = trialEndsAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTrialDaysRemaining(diffDays > 0 ? diffDays : 0);

        if (now > trialEndsAt) {
          if (activeWorkspace.access_state !== 'TRIAL_EXPIRED_LOCKED') {
            await supabase
              .from('workspaces')
              .update({ access_state: 'TRIAL_EXPIRED_LOCKED' })
              .eq('id', activeWorkspace.id);
            setActiveWorkspace(prev => prev ? { ...prev, access_state: 'TRIAL_EXPIRED_LOCKED' } : null);
          }
          setIsLocked(true);
        } else {
          if (isLocked) setIsLocked(false);
        }
      } else {
        setTrialDaysRemaining(null);
        if (isLocked) setIsLocked(false);
      }
    };
    checkLock();
  }, [activeWorkspace, isLocked]);

  const activeWorkspaceIdRef = useRef<string | null>(
    localStorage.getItem('activeWorkspaceId')
  );
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const fetchWorkspaces = useCallback(async (force = false) => {
    if (authLoading && !force) return;

    if (!user) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setActiveMember(null);
      setLoading(false);
      hasFetchedRef.current = false;
      return;
    }

    if (impersonatedWorkspaceId) {
      const { data: ws, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', impersonatedWorkspaceId)
        .single();

      if (ws && !error) {
        const workspace = {
          ...ws,
          is_check_in_enabled: !!ws.is_check_in_enabled
        } as Workspace;
        setWorkspaces([workspace]);
        setActiveWorkspace(workspace);
        setActiveMember({
          id: 'super-admin-member',
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'OWNER',
          status: 'active'
        });
        setLoading(false);
        return;
      }
    }

    if (isFetchingRef.current && !force) return;
    isFetchingRef.current = true;

    try {
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select('*, workspaces(*)')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (membersError) {
        console.error('Error fetching workspaces:', membersError);
        setLoading(false);
        return;
      }

      const wsList = (members || [])
        .map((m: any) => ({
          ...(m.workspaces as Workspace),
          is_check_in_enabled: !!m.workspaces?.is_check_in_enabled
        }))
        .filter((ws: any) => ws !== null && ws.id);

      setWorkspaces(wsList);

      let currentId = activeWorkspaceIdRef.current;
      const activeWs = (currentId ? wsList.find((w: any) => w.id === currentId) : null) || wsList[0];

      if (activeWs) {
        setActiveWorkspace(activeWs);
        const member = members?.find((m: any) => m.workspace_id === activeWs.id);
        setActiveMember(member || null);

        if (activeWs.id !== activeWorkspaceIdRef.current) {
          activeWorkspaceIdRef.current = activeWs.id;
          localStorage.setItem('activeWorkspaceId', activeWs.id);
        }
      } else {
        setActiveWorkspace(null);
        setActiveMember(null);
      }
    } catch (err) {
      console.error('Unexpected error in fetchWorkspaces:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      hasFetchedRef.current = true;
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchWorkspaces(!!impersonatedWorkspaceId);
    }
  }, [fetchWorkspaces, authLoading, impersonatedWorkspaceId]);

  useEffect(() => {
    if (!user || !activeWorkspace) return;

    const channel = supabase
      .channel('member-role-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workspace_members',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWorkspaces(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeWorkspace, fetchWorkspaces]);

  const refreshWorkspaces = useCallback(async () => {
    return fetchWorkspaces(true);
  }, [fetchWorkspaces]);

  const setActiveWorkspaceId = useCallback((id: string) => {
    activeWorkspaceIdRef.current = id;
    localStorage.setItem('activeWorkspaceId', id);
    const ws = workspaces.find(w => w.id === id);
    if (ws) {
      setActiveWorkspace(ws);
      if (user?.id) {
        supabase
          .from('workspace_members')
          .select('*')
          .eq('user_id', user.id)
          .eq('workspace_id', id)
          .single()
          .then(({ data }) => setActiveMember(data))
          .then(undefined, err => console.error('Error setting active member:', err));
      }
    }
  }, [workspaces, user?.id]);

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      activeWorkspace,
      activeMember,
      setActiveWorkspaceId,
      refreshWorkspaces,
      loading,
      isLocked,
      isTrialActive,
      trialDaysRemaining,
      isLaunchpad,
      clientCount,
      userCount,
      canAddClient,
      canAddUser,
      hasBillingAccess,
      hasAdvancedReporting,
      planLimits,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
