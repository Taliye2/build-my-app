import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, FileText, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(173, 80%, 40%)', 'hsl(160, 84%, 39%)', 'hsl(239, 84%, 67%)', 'hsl(38, 92%, 50%)'];

const AnalyticsPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [stats, setStats] = useState({ clients: 0, events: 0, invoices: 0, revenue: 0 });
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    Promise.all([
      supabase.from('clients').select('id, status', { count: 'exact' }).eq('workspace_id', activeWorkspace.id),
      supabase.from('service_events').select('id', { count: 'exact', head: true }).eq('workspace_id', activeWorkspace.id),
      supabase.from('invoices').select('id, subtotal', { count: 'exact' }).eq('workspace_id', activeWorkspace.id),
    ]).then(([cRes, eRes, iRes]) => {
      const clients = cRes.data || [];
      const invoices = iRes.data || [];
      setStats({
        clients: cRes.count || 0,
        events: eRes.count || 0,
        invoices: iRes.count || 0,
        revenue: invoices.reduce((sum: number, i: any) => sum + Number(i.subtotal || 0), 0),
      });
      const statusMap: Record<string, number> = {};
      clients.forEach((c: any) => { statusMap[c.status] = (statusMap[c.status] || 0) + 1; });
      setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
      setLoading(false);
    });
  }, [activeWorkspace]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading analytics...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Analytics</h1><p className="text-sm text-muted-foreground mt-1">Workspace performance and insights</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: stats.clients, icon: Users, color: 'text-primary' },
          { label: 'Service Events', value: stats.events, icon: Briefcase, color: 'text-brand-emerald' },
          { label: 'Invoices', value: stats.invoices, icon: FileText, color: 'text-warning' },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-muted-foreground">{s.label}</span></div>
            <p className="text-2xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {statusData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="text-base">Client Status Distribution</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Clients by Status</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" className="stroke-border" /><XAxis dataKey="name" className="text-xs" /><YAxis className="text-xs" /><Tooltip /><Bar dataKey="value" fill="hsl(173, 80%, 40%)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;