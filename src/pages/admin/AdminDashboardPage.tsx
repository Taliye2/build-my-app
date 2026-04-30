import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CreditCard, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface DashboardStats {
  totalOrgs: number;
  activeOrgs: number;
  trialingOrgs: number;
  expiredOrgs: number;
  totalLeads: number;
  recentPayments: number;
}

interface RecentWorkspace {
  id: string;
  name: string;
  plan_status: string | null;
  trial_start_date: string | null;
  created_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrgs: 0, activeOrgs: 0, trialingOrgs: 0, expiredOrgs: 0, totalLeads: 0, recentPayments: 0,
  });
  const [recentOrgs, setRecentOrgs] = useState<RecentWorkspace[]>([]);
  const [expiringOrgs, setExpiringOrgs] = useState<RecentWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allWs, leadsRes, paymentsRes] = await Promise.all([
          supabase.from('workspaces').select('id, name, plan_status, trial_start_date, created_at, access_state'),
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('billing_events').select('id', { count: 'exact', head: true }),
        ]);

        const workspaces = allWs.data || [];
        const active = workspaces.filter(w => w.plan_status === 'active');
        const trialing = workspaces.filter(w => w.plan_status === 'trialing' || w.plan_status === 'trial');
        const expired = workspaces.filter(w => w.access_state === 'TRIAL_EXPIRED_LOCKED');

        setStats({
          totalOrgs: workspaces.length,
          activeOrgs: active.length,
          trialingOrgs: trialing.length,
          expiredOrgs: expired.length,
          totalLeads: leadsRes.count || 0,
          recentPayments: paymentsRes.count || 0,
        });

        // Recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recent = workspaces
          .filter(w => new Date(w.created_at) > thirtyDaysAgo)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentOrgs(recent);

        // Trials expiring soon (within 7 days)
        const now = new Date();
        const expiring = trialing.filter(w => {
          if (!w.trial_start_date) return false;
          const start = new Date(w.trial_start_date);
          const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return daysElapsed >= 23; // within 7 days of 30-day trial ending
        });
        setExpiringOrgs(expiring);
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTrialDaysLeft = (trialStart: string | null) => {
    if (!trialStart) return null;
    const start = new Date(trialStart);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - elapsed);
  };

  const getStatusBadge = (ws: RecentWorkspace) => {
    if (ws.plan_status === 'active') return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    if (ws.plan_status === 'trialing' || ws.plan_status === 'trial') {
      const days = getTrialDaysLeft(ws.trial_start_date);
      return <Badge variant="outline" className="text-warning border-warning/30">{days}d trial left</Badge>;
    }
    return <Badge variant="destructive">Expired</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading admin dashboard...</div></div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Kafiskey Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Orgs', value: stats.totalOrgs, icon: Building2, color: 'text-primary' },
          { label: 'Active', value: stats.activeOrgs, icon: TrendingUp, color: 'text-success' },
          { label: 'Trialing', value: stats.trialingOrgs, icon: Clock, color: 'text-warning' },
          { label: 'Expired', value: stats.expiredOrgs, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Leads', value: stats.totalLeads, icon: Users, color: 'text-primary' },
          { label: 'Payments', value: stats.recentPayments, icon: CreditCard, color: 'text-success' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Signups (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent signups.</p>
            ) : (
              <div className="space-y-3">
                {recentOrgs.map(ws => (
                  <div key={ws.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{ws.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ws.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(ws)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Trials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Trials Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringOrgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trials expiring in the next 7 days.</p>
            ) : (
              <div className="space-y-3">
                {expiringOrgs.map(ws => (
                  <div key={ws.id} className="flex items-center justify-between">
                    <p className="text-sm font-medium">{ws.name}</p>
                    <Badge variant="outline" className="text-warning border-warning/30">
                      {getTrialDaysLeft(ws.trial_start_date)}d left
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;