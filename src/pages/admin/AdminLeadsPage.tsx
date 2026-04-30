import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  created_at: string;
}

const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_person: '', email: '', phone: '', notes: '', source: '' });

  const fetchLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreate = async () => {
    if (!form.company_name || !form.contact_person || !form.email) {
      toast.error('Please fill in required fields');
      return;
    }
    const { error } = await supabase.from('leads').insert(form);
    if (error) { toast.error('Failed to add lead'); console.error(error); }
    else {
      toast.success('Lead added');
      setForm({ company_name: '', contact_person: '', email: '', phone: '', notes: '', source: '' });
      setDialogOpen(false);
      fetchLeads();
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast.success('Status updated');
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      New: 'bg-primary/10 text-primary border-primary/20',
      Contacted: 'bg-warning/10 text-warning border-warning/20',
      Qualified: 'bg-success/10 text-success border-success/20',
      Converted: 'bg-success/10 text-success border-success/20',
    };
    return <Badge className={map[status] || ''}>{status}</Badge>;
  };

  const filtered = leads.filter(l =>
    l.company_name.toLowerCase().includes(search.toLowerCase()) ||
    l.contact_person.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading leads...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage prospective customers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Company Name *</Label><Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} /></div>
              <div><Label>Contact Person *</Label><Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} /></div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><Label>Source</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. Website, Referral" /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <Button onClick={handleCreate} className="w-full">Add Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.company_name}</TableCell>
                  <TableCell>{l.contact_person}</TableCell>
                  <TableCell className="text-sm">{l.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.source || '—'}</TableCell>
                  <TableCell>{getStatusBadge(l.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={l.status} onValueChange={v => handleStatusChange(l.id, v)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No leads found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadsPage;