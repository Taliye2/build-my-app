import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, FileText, DollarSign, Sparkles, ArrowRight } from 'lucide-react';

const BillingPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    supabase.from('invoices').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { setInvoices(data || []); setLoading(false); });
  }, [activeWorkspace]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading billing...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Billing</h1><p className="text-sm text-muted-foreground mt-1">Client invoices and plan information</p></div>
        <Button asChild variant="outline"><Link to="/billing/plan">View Plan <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
      </div>

      {/* Plan Status */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10"><Sparkles className="h-6 w-6 text-primary" /></div>
          <div><p className="text-xs text-muted-foreground">Current Plan</p><p className="text-lg font-bold">Free</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10"><CreditCard className="h-6 w-6 text-success" /></div>
          <div><p className="text-xs text-muted-foreground">Access</p><Badge className="bg-success/10 text-success">Full Access</Badge></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted"><FileText className="h-6 w-6 text-muted-foreground" /></div>
          <div><p className="text-xs text-muted-foreground">Client Invoices</p><p className="text-lg font-bold">{invoices.length}</p></div>
        </CardContent></Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle><CardDescription>Recent billing documents</CardDescription></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Period</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.period_start && inv.period_end ? `${new Date(inv.period_start).toLocaleDateString()} – ${new Date(inv.period_end).toLocaleDateString()}` : '—'}</TableCell>
                  <TableCell className="text-sm">${Number(inv.subtotal || 0).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={inv.status === 'PAID' ? 'default' : 'outline'} className={inv.status === 'PAID' ? 'bg-success/10 text-success' : ''}>{inv.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No invoices yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;