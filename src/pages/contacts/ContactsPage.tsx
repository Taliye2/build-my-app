import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Contact2 } from 'lucide-react';
import { toast } from 'sonner';
import { AddressFields, PhoneInput } from '@/components/forms/FormFields';
import { RELATIONSHIP_OPTIONS, STATUS_OPTIONS, isValidPhone } from '@/lib/formHelpers';

const emptyContactForm = {
  first_name: '', last_name: '', email: '', phone: '', organization: '', relationship: '',
  street_address: '', city: '', state: '', zip_code: '', country: 'US',
  status: 'Active', notes: '',
};

const ContactsPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyContactForm });
  const [submitting, setSubmitting] = useState(false);

  const fetchContacts = async () => {
    if (!activeWorkspace) return;
    const { data } = await supabase.from('contacts').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, [activeWorkspace]);

  const handleCreate = async (addAnother = false) => {
    if (!form.first_name || !form.last_name || !activeWorkspace) { toast.error('First and last name are required'); return; }
    if (!isValidPhone(form.phone)) { toast.error('Phone must be (XXX) XXX-XXXX'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('contacts').insert({
      ...form,
      active: form.status === 'Active',
      workspace_id: activeWorkspace.id,
    });
    setSubmitting(false);
    if (error) { toast.error('Failed to add contact'); return; }
    toast.success('Contact added');
    setForm({ ...emptyContactForm });
    if (!addAnother) setDialogOpen(false);
    fetchContacts();
  };

  const filtered = contacts.filter(c => `${c.first_name} ${c.last_name} ${c.email || ''} ${c.organization || ''}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading contacts...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Contacts</h1><p className="text-sm text-muted-foreground mt-1">Manage external contacts and relationships</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Contact</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name *</Label><Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} /></div>
                <div><Label>Last Name *</Label><Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><Label>Phone</Label><PhoneInput value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Organization</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
                <div>
                  <Label>Relationship</Label>
                  <Select value={form.relationship} onValueChange={v => setForm(f => ({ ...f, relationship: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AddressFields
                value={form}
                onChange={next => setForm(f => ({ ...f, ...next }))}
              />
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional context..." />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleCreate(true)} disabled={submitting}>Save & Add Another</Button>
              <Button onClick={() => handleCreate(false)} disabled={submitting}>{submitting ? 'Saving...' : 'Add Contact'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Organization</TableHead><TableHead>Relationship</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell><Link to={`/contacts/${c.id}`} className="font-medium hover:text-primary transition-colors">{c.first_name} {c.last_name}</Link></TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.organization || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.relationship || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.email || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.phone || '—'}</TableCell>
                <TableCell><Badge variant={(c.status || (c.active === false ? 'Inactive' : 'Active')) === 'Active' ? 'default' : 'secondary'}>{c.status || (c.active === false ? 'Inactive' : 'Active')}</Badge></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12"><Contact2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No contacts found.</p></TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ContactsPage;