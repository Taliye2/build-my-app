import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Layers, Search } from 'lucide-react';
import { toast } from 'sonner';

const ProgramsPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('workspace_id', activeWorkspace.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load programs');
    setPrograms(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [activeWorkspace]);

  const handleCreate = async () => {
    if (!form.name.trim() || !activeWorkspace) { toast.error('Program name is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('programs').insert({
      workspace_id: activeWorkspace.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Program created');
    setForm({ name: '', description: '' });
    setOpen(false);
    load();
  };

  const filtered = programs.filter(p => `${p.name} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage service programs and enrollments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Program</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Program</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Job Readiness 2026" /></div>
              <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this program offer?" /></div>
              <Button onClick={handleCreate} disabled={saving} className="w-full">{saving ? 'Creating…' : 'Create Program'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.description || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={3} className="text-center py-12">
                <Layers className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No programs yet. Click "Add Program" to create one.</p>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ProgramsPage;
