import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users2, Mail, Copy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const TeamPage: React.FC = () => {
  const { activeWorkspace, activeMember } = useWorkspace();
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'STAFF' });

  const fetchData = async () => {
    if (!activeWorkspace) return;
    const [mRes, iRes] = await Promise.all([
      supabase.from('workspace_members').select('*').eq('workspace_id', activeWorkspace.id).order('created_at'),
      supabase.from('invites').select('*').eq('workspace_id', activeWorkspace.id).eq('status', 'pending').order('created_at', { ascending: false }),
    ]);
    setMembers(mRes.data || []);
    setInvites(iRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeWorkspace]);

  const handleInvite = async () => {
    if (!form.email || !activeWorkspace) { toast.error('Email is required'); return; }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const { error } = await supabase.from('invites').insert({
      workspace_id: activeWorkspace.id,
      email: form.email,
      full_name: form.full_name,
      role: form.role,
      expires_at: expiresAt.toISOString(),
    });
    if (error) toast.error('Failed to send invite');
    else { toast.success('Invite sent'); setForm({ email: '', full_name: '', role: 'STAFF' }); setDialogOpen(false); fetchData(); }
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
        <div><h1 className="text-2xl font-semibold">Team</h1><p className="text-sm text-muted-foreground mt-1">Manage workspace members and invitations</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Invite Member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="team@example.com" /></div>
              <div><Label>Full Name</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
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
              <Button onClick={handleInvite} className="w-full">Send Invite</Button>
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
          <CardHeader><CardTitle className="text-base">Pending Invites ({invites.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Expires</TableHead></TableRow></TableHeader>
              <TableBody>
                {invites.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="text-sm">{i.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{i.full_name || '—'}</TableCell>
                    <TableCell>{getRoleBadge(i.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(i.expires_at).toLocaleDateString()}</TableCell>
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