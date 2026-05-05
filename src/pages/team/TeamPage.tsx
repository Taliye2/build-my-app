import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Link2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const TeamPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'STAFF', max_uses: '', expires_in_days: '7' });

  const fetchData = async () => {
    if (!activeWorkspace) return;
    const [mRes, iRes] = await Promise.all([
      supabase.from('workspace_members').select('*').eq('workspace_id', activeWorkspace.id).order('created_at'),
      supabase.from('invites').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false }),
    ]);
    setMembers(mRes.data || []);
    setInvites(iRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeWorkspace]);

  const handleInvite = async () => {
    if (!activeWorkspace) return;
    let expiresAt: string | null = null;
    if (form.expires_in_days && Number(form.expires_in_days) > 0) {
      const d = new Date();
      d.setDate(d.getDate() + Number(form.expires_in_days));
      expiresAt = d.toISOString();
    }
    const { data, error } = await supabase.from('invites').insert({
      workspace_id: activeWorkspace.id,
      email: form.email || null,
      full_name: form.full_name || null,
      role: form.role,
      expires_at: expiresAt,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      created_by: user?.id ?? null,
    }).select().single();
    if (error) { toast.error('Failed to create invite'); return; }
    const link = `${window.location.origin}/auth?invite=${data.token}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    toast.success('Invite created and link copied to clipboard');
    setForm({ email: '', full_name: '', role: 'STAFF', max_uses: '', expires_in_days: '7' });
    setDialogOpen(false);
    fetchData();
  };

  const copyLink = async (token: string) => {
    const link = `${window.location.origin}/auth?invite=${token}`;
    await navigator.clipboard.writeText(link);
    toast.success('Invite link copied');
  };

  const revokeInvite = async (id: string) => {
    const { error } = await supabase.from('invites').update({ status: 'revoked' }).eq('id', id);
    if (error) toast.error('Failed to revoke invite');
    else { toast.success('Invite revoked'); fetchData(); }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      OWNER: 'bg-primary/10 text-primary',
      ADMIN: 'bg-brand-indigo/10 text-brand-indigo',
      MANAGER: 'bg-warning/10 text-warning',
      STAFF: 'bg-muted text-muted-foreground',
      READ_ONLY: 'bg-muted text-muted-foreground',
    };
    return <Badge className={colors[role] || ''}>{role}</Badge>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading team...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Team</h1><p className="text-sm text-muted-foreground mt-1">Manage workspace members and shareable invite links</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Create Invite Link</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Invite Link</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Email (optional)</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Lock invite to a specific email" /></div>
              <div><Label>Full Name (optional)</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
              <div><Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="READ_ONLY">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Max uses</Label>
                  <Input type="number" min="1" placeholder="Unlimited" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} />
                </div>
                <div>
                  <Label>Expires in (days)</Label>
                  <Input type="number" min="0" placeholder="Never" value={form.expires_in_days} onChange={e => setForm(f => ({ ...f, expires_in_days: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleInvite} className="w-full"><Link2 className="h-4 w-4 mr-2" />Generate Invite Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members */}
      <Card>
        <CardHeader><CardTitle className="text-base">Members ({members.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader>
            <TableBody>
              {members.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{(m.full_name || 'U')[0]}</AvatarFallback></Avatar>
                      <span className="font-medium text-sm">{m.full_name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(m.role)}</TableCell>
                  <TableCell><Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Invite Links ({invites.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Uses</TableHead><TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {invites.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="text-sm">{i.email || <span className="text-muted-foreground">Anyone</span>}</TableCell>
                    <TableCell>{getRoleBadge(i.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{i.uses_count || 0}{i.max_uses ? ` / ${i.max_uses}` : ''}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{i.expires_at ? new Date(i.expires_at).toLocaleDateString() : 'Never'}</TableCell>
                    <TableCell><Badge variant={i.status === 'pending' ? 'default' : 'secondary'}>{i.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {i.status === 'pending' && (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => copyLink(i.token)}><Copy className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => revokeInvite(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPage;