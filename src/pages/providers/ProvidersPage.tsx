import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserSquare2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const ProvidersPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', title: '', email: '', phone: '' });

  const load = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    const { data } = await supabase.from('staff_profiles').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false });
    setProviders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [activeWorkspace]);

  const handleCreate = async () => {
    if (!activeWorkspace) return;
    if (!form.first_name.trim() && !form.last_name.trim()) {
      toast({ title: 'Name required', description: 'Enter first or last name.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const full_name = `${form.first_name} ${form.last_name}`.trim();
    const { error } = await supabase.from('staff_profiles').insert({
      workspace_id: activeWorkspace.id,
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      full_name: full_name || null,
      title: form.title || null,
      email: form.email || null,
      phone: form.phone || null,
      active: true,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Failed to add provider', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Provider added' });
    setForm({ first_name: '', last_name: '', title: '', email: '', phone: '' });
    setOpen(false);
    load();
  };

  const filtered = providers.filter(p =>
    `${p.first_name || ''} ${p.last_name || ''} ${p.full_name || ''} ${p.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading providers...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Providers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage service providers and staff credentials</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Provider</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search providers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link to={`/providers/${p.id}`} className="font-medium hover:text-primary transition-colors">
                      {p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unnamed'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.title || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.email || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.phone || p.phone_number || '—'}</TableCell>
                  <TableCell><Badge variant={p.active !== false ? 'default' : 'secondary'}>{p.active !== false ? 'Active' : 'Inactive'}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12">
                  <UserSquare2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No providers found.</p>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Provider</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>First name</Label>
              <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Last name</Label>
              <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Therapist" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? 'Adding...' : 'Add Provider'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProvidersPage;