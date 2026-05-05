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
import { Plus, Search, Mail, Send, Eye } from 'lucide-react';
import { toast } from 'sonner';

const EmailTemplatesPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', body: '', category: 'General' });
  const [sendOpen, setSendOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [extraEmails, setExtraEmails] = useState('');
  const [sendSubject, setSendSubject] = useState('');
  const [sendBody, setSendBody] = useState('');

  const fetchTemplates = async () => {
    if (!activeWorkspace) return;
    const { data } = await supabase.from('email_templates').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, [activeWorkspace]);

  const openSend = async (t: any) => {
    setActiveTemplate(t);
    setSendSubject(t.subject || '');
    setSendBody(t.body || '');
    setSelected({});
    setExtraEmails('');
    setSendOpen(true);
    if (activeWorkspace) {
      const { data } = await supabase
        .from('workspace_members')
        .select('user_id, full_name, email, role')
        .eq('workspace_id', activeWorkspace.id)
        .eq('status', 'active');
      setMembers((data || []).filter((m: any) => m.email));
    }
  };

  const handleSend = () => {
    const picked = members.filter(m => selected[m.user_id]).map(m => m.email);
    const extras = extraEmails.split(/[,\s;]+/).map(s => s.trim()).filter(Boolean);
    const all = Array.from(new Set([...picked, ...extras]));
    if (all.length === 0) { toast.error('Pick at least one recipient'); return; }
    const url = `mailto:${encodeURIComponent(all.join(','))}?subject=${encodeURIComponent(sendSubject)}&body=${encodeURIComponent(sendBody)}`;
    window.location.href = url;
    toast.success('Opening your email client…');
    setSendOpen(false);
  };

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
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.category || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setActiveTemplate(t); setPreviewOpen(true); }}><Eye className="h-4 w-4 mr-1" />Preview</Button>
                    <Button size="sm" onClick={() => openSend(t)}><Send className="h-4 w-4 mr-1" />Send</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-12"><Mail className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No email templates yet.</p></TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{activeTemplate?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><div className="text-xs text-muted-foreground">Subject</div><div className="text-sm font-medium">{activeTemplate?.subject}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Body</div><div className="text-sm whitespace-pre-wrap rounded-md border p-3 bg-muted/30">{activeTemplate?.body}</div></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Send: {activeTemplate?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workspace recipients</Label>
              <div className="mt-2 max-h-40 overflow-auto rounded-md border divide-y">
                {members.length === 0 && <div className="p-3 text-sm text-muted-foreground">No members with email found.</div>}
                {members.map(m => (
                  <label key={m.user_id} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/40">
                    <input type="checkbox" checked={!!selected[m.user_id]} onChange={e => setSelected(s => ({ ...s, [m.user_id]: e.target.checked }))} />
                    <span className="text-sm flex-1">{m.full_name || m.email}</span>
                    <span className="text-xs text-muted-foreground">{m.email}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Other emails (comma separated)</Label>
              <Input value={extraEmails} onChange={e => setExtraEmails(e.target.value)} placeholder="client@example.com, another@example.com" />
            </div>
            <div><Label>Subject</Label><Input value={sendSubject} onChange={e => setSendSubject(e.target.value)} /></div>
            <div><Label>Body</Label><Textarea rows={6} value={sendBody} onChange={e => setSendBody(e.target.value)} /></div>
            <p className="text-xs text-muted-foreground">This will open your default email app (Gmail, Outlook, Apple Mail, etc.) so the message is sent from your own address — works with any company domain.</p>
            <Button onClick={handleSend} className="w-full"><Send className="h-4 w-4 mr-2" />Open in email client</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesPage;