import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Users, UserPlus, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  date_joined: string | null;
  tags: string[];
}

const ClientListPage: React.FC = () => {
  const { activeWorkspace, canAddClient } = useWorkspace();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    if (!activeWorkspace) return;
    const { data, error } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email, phone, status, date_joined, tags')
      .eq('workspace_id', activeWorkspace.id)
      .order('created_at', { ascending: false });
    if (!error) setClients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, [activeWorkspace]);

  const handleCreate = async () => {
    if (!form.first_name || !form.last_name) {
      toast.error('First and last name are required');
      return;
    }
    if (!activeWorkspace) return;
    if (!canAddClient) {
      toast.error('Client limit reached. Upgrade your plan to add more.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('clients').insert({
      ...form,
      workspace_id: activeWorkspace.id,
      status: 'ACTIVE',
    });
    if (error) {
      toast.error('Failed to add client');
    } else {
      toast.success('Client added successfully');
      setForm({ first_name: '', last_name: '', email: '', phone: '' });
      setDialogOpen(false);
      fetchClients();
    }
    setSubmitting(false);
  };

  const filtered = clients.filter(c => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: clients.length,
    ACTIVE: clients.filter(c => c.status === 'ACTIVE').length,
    INACTIVE: clients.filter(c => c.status === 'INACTIVE').length,
    DISCHARGED: clients.filter(c => c.status === 'DISCHARGED').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading clients...</div></div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your client roster and profiles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddClient}>
              <UserPlus className="h-4 w-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name *</Label><Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="John" /></div>
                <div><Label>Last Name *</Label><Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Doe" /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" /></div>
              <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" /></div>
              <Button onClick={handleCreate} className="w-full" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Client'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: statusCounts.all, icon: Users },
          { label: 'Active', count: statusCounts.ACTIVE, color: 'text-success' },
          { label: 'Inactive', count: statusCounts.INACTIVE, color: 'text-warning' },
          { label: 'Discharged', count: statusCounts.DISCHARGED, color: 'text-muted-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color || ''}`}>{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="DISCHARGED">Discharged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link to={`/clients/${c.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {c.first_name} {c.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.email || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'ACTIVE' ? 'default' : 'secondary'} className={c.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : ''}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.date_joined ? new Date(c.date_joined).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{clients.length === 0 ? 'No clients yet. Add your first client to get started.' : 'No clients match your search.'}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientListPage;