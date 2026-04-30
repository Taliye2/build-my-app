import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Mail, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EmailTemplatesPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', body: '', category: 'General' });

  const fetchTemplates = async () => {
    if (!activeWorkspace) return;
    const { data } = await supabase.from('email_templates').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, [activeWorkspace]);

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.body || !activeWorkspace) { toast.error('All fields are required'); return; }
    const { error } = await supabase.from('email_templates').insert({ ...form, workspace_id: activeWorkspace.id, created_by: user?.id });
    if (error) toast.error('Failed to create template');
    else { toast.success('Template created'); setForm({ name: '', subject: '', body: '', category: 'General' }); setDialogOpen(false); fetchTemplates(); }
  };

  const filtered = templates.filter(t => `${t.name} ${t.subject}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading templates...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Email Templates</h1><p className="text-sm text-muted-foreground mt-1">Create and manage reusable email templates</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Template</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Welcome Email" /></div>
              <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Email subject line" /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Onboarding" /></div>
              <div><Label>Body</Label><Textarea rows={8} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your email template..." /></div>
              <Button onClick={handleCreate} className="w-full">Create Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.category || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12"><Mail className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No email templates yet.</p></TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default EmailTemplatesPage;