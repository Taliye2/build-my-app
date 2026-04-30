import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, DollarSign, Clock } from 'lucide-react';

const PayrollPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    supabase.from('service_events').select('*, clients(first_name, last_name), service_templates(name)')
      .eq('workspace_id', activeWorkspace.id).eq('status', 'approved').order('date', { ascending: false }).limit(50)
      .then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, [activeWorkspace]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading payroll...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Payroll</h1><p className="text-sm text-muted-foreground mt-1">Process payroll from approved service events</p></div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10"><Wallet className="h-6 w-6 text-primary" /></div>
          <div><p className="text-xs text-muted-foreground">Approved Events</p><p className="text-2xl font-bold">{events.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10"><DollarSign className="h-6 w-6 text-success" /></div>
          <div><p className="text-xs text-muted-foreground">Total Units</p><p className="text-2xl font-bold">{events.reduce((s, e) => s + Number(e.units || 0), 0).toFixed(1)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/10"><Clock className="h-6 w-6 text-warning" /></div>
          <div><p className="text-xs text-muted-foreground">Pending Review</p><p className="text-2xl font-bold">0</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Approved Service Events</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Service</TableHead><TableHead>Date</TableHead><TableHead>Units</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {events.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.clients?.first_name} {e.clients?.last_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.service_templates?.name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.date ? new Date(e.date).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="text-sm">{e.units || '—'}</TableCell>
                  <TableCell><Badge className="bg-success/10 text-success">Approved</Badge></TableCell>
                </TableRow>
              ))}
              {events.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No approved events for payroll processing.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPage;