import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CompliancePage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [ack, setAck] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace || !user) return;
    Promise.all([
      supabase.from('hipaa_acknowledgments').select('*').eq('user_id', user.id).eq('workspace_id', activeWorkspace.id).maybeSingle(),
      supabase.from('audit_logs').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false }).limit(20),
    ]).then(([ackRes, logsRes]) => {
      setAck(ackRes.data);
      setAuditLogs(logsRes.data || []);
      setLoading(false);
    });
  }, [activeWorkspace, user]);

  const handleAcknowledge = async () => {
    if (!activeWorkspace || !user) return;
    const { error } = await supabase.from('hipaa_acknowledgments').upsert({
      user_id: user.id,
      workspace_id: activeWorkspace.id,
      acknowledged_at: new Date().toISOString(),
    }, { onConflict: 'user_id,workspace_id' });
    if (error) toast.error('Failed to save acknowledgment');
    else { toast.success('HIPAA acknowledgment saved'); setAck({ acknowledged_at: new Date().toISOString() }); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading compliance...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Compliance</h1><p className="text-sm text-muted-foreground mt-1">HIPAA compliance and audit tools</p></div>

      {/* HIPAA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />HIPAA Acknowledgment</CardTitle>
          <CardDescription>Confirm your understanding of HIPAA privacy requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {ack ? (
            <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /><div><p className="text-sm font-medium">Acknowledged</p><p className="text-xs text-muted-foreground">Signed on {new Date(ack.acknowledged_at).toLocaleString()}</p></div></div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /><p className="text-sm">You have not acknowledged HIPAA requirements.</p></div>
              <Button onClick={handleAcknowledge}>Acknowledge HIPAA Requirements</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-5 w-5" />Recent Audit Logs</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {auditLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell><Badge variant="outline" className="text-xs">{log.action}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.entity_type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {auditLogs.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No audit logs recorded yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancePage;