import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp } from 'lucide-react';

interface PaymentEvent {
  id: string;
  stripe_event_id: string;
  event_type: string;
  payload_json: any;
  created_at: string;
  workspace_id: string | null;
}

interface WorkspacePayment {
  id: string;
  name: string;
  plan_status: string | null;
  plan_key: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

const AdminPaymentsPage: React.FC = () => {
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [paidOrgs, setPaidOrgs] = useState<WorkspacePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [eventsRes, orgsRes] = await Promise.all([
        supabase.from('billing_events').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('workspaces').select('id, name, plan_status, plan_key, stripe_customer_id, stripe_subscription_id')
          .eq('plan_status', 'active'),
      ]);
      setEvents(eventsRes.data || []);
      setPaidOrgs(orgsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getEventBadge = (type: string) => {
    if (type.includes('succeeded') || type.includes('paid')) return <Badge className="bg-success/10 text-success border-success/20">{type}</Badge>;
    if (type.includes('failed')) return <Badge variant="destructive">{type}</Badge>;
    return <Badge variant="outline">{type}</Badge>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading payments...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track payment events and paying customers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paying Customers</p>
              <p className="text-2xl font-bold">{paidOrgs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paying Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Paying Customers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Stripe Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidOrgs.map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="capitalize">{org.plan_key || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{org.stripe_customer_id || '—'}</TableCell>
                </TableRow>
              ))}
              {paidOrgs.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No paying customers yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Payment Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Stripe Event ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell>{getEventBadge(ev.event_type)}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{ev.stripe_event_id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No payment events recorded.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentsPage;