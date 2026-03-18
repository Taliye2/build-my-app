import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  Receipt,
  Briefcase,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [stats, setStats] = useState({
    clients: 0,
    activeServices: 0,
    pendingDocumentation: 0,
    pendingApprovals: 0,
    scheduledToday: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWorkspace) return;
      setLoading(true);
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');

      try {
        const [clientsCount, servicesCount, approvalsCount, recentRes, scheduledRes, activityRes] = await Promise.all([
          supabase.from('clients').select('*', { count: 'exact', head: true }).eq('workspace_id', activeWorkspace.id).eq('status', 'ACTIVE'),
          supabase.from('service_events').select('*', { count: 'exact', head: true }).eq('workspace_id', activeWorkspace.id),
          supabase.from('service_events').select('*', { count: 'exact', head: true }).eq('workspace_id', activeWorkspace.id).eq('status', 'SUBMITTED'),
          supabase.from('service_events').select('*, clients(*), service_templates(*)').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('service_events').select('*', { count: 'exact', head: true }).eq('workspace_id', activeWorkspace.id).eq('date', todayStr),
          supabase.from('service_events').select('date').eq('workspace_id', activeWorkspace.id).gte('date', format(subDays(today, 6), 'yyyy-MM-dd')).lte('date', todayStr)
        ]);

        setStats({
          clients: clientsCount.count || 0,
          activeServices: servicesCount.count || 0,
          pendingDocumentation: 0,
          pendingApprovals: approvalsCount.count || 0,
          scheduledToday: scheduledRes.count || 0
        });
        setRecentEvents(recentRes.data || []);

        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = subDays(today, i);
          const dateStr = format(d, 'yyyy-MM-dd');
          const count = activityRes.data?.filter((ev: any) => ev.date === dateStr).length || 0;
          days.push({ name: format(d, 'EEE'), events: count });
        }
        setChartData(days);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeWorkspace]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Operational command center for your workspace.</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.clients}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.clients === 0 ? 'Add your first client.' : 'Active and tracked'}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Delivered</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activeServices}</div>
            <p className="text-xs text-muted-foreground mt-1">Total workspace lifetime</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation Due</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.pendingDocumentation}</div>
            <p className="text-xs text-muted-foreground mt-1">All documented.</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingApprovals > 0 ? 'Awaiting review.' : 'No pending approvals.'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Service Activity</CardTitle>
            <CardDescription>Weekly service delivery volume.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 || stats.activeServices === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No activity data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
            <CardDescription>Daily operational awareness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Services Scheduled</p>
                <p className="text-xs text-muted-foreground">{stats.scheduledToday} sessions today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium">Documentation Due</p>
                <p className="text-xs text-muted-foreground">{stats.pendingDocumentation} records pending</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Receipt className="h-4 w-4 text-brand-emerald" />
              <div>
                <p className="text-sm font-medium">Payroll Pending</p>
                <p className="text-xs text-muted-foreground">Review approved records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
          <CardDescription>Latest entries across all clients.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent events recorded.</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event: any, i: number) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium text-primary">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.clients?.first_name} {event.clients?.last_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.service_templates?.name || 'General Service'}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{event.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
