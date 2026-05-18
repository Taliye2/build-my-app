import React, { useEffect, useState, useCallback } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Clock, Users, Plus, MoreHorizontal, UserPlus, User, Briefcase, Phone, Hourglass } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

type QueueStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

const STATUS_LABEL: Record<QueueStatus, string> = {
  WAITING: 'Waiting', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled', NO_SHOW: 'No Show',
};
const STATUS_STYLE: Record<QueueStatus, string> = {
  WAITING: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
  IN_PROGRESS: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
  CANCELLED: 'bg-muted text-muted-foreground border border-border',
  NO_SHOW: 'bg-destructive/15 text-destructive border border-destructive/30',
};
const STATUS_BAR: Record<QueueStatus, string> = {
  WAITING: 'bg-amber-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-muted-foreground/40',
  NO_SHOW: 'bg-destructive',
};
const PRIORITY_STYLE: Record<Priority, string> = {
  LOW: 'bg-muted text-muted-foreground border border-border',
  NORMAL: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
  HIGH: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30',
  URGENT: 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30',
};

const QueuePage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [clientId, setClientId] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [notes, setNotes] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');

  const load = useCallback(async () => {
    if (!activeWorkspace) return;
    const [evRes, qRes, cRes, sRes] = await Promise.all([
      supabase.from('service_events').select('*, clients(first_name, last_name), service_templates(name)')
        .eq('workspace_id', activeWorkspace.id).eq('date', today).order('start_time'),
      supabase.from('queue_entries').select('*')
        .eq('workspace_id', activeWorkspace.id).eq('queue_date', today).order('created_at'),
      supabase.from('clients').select('id, first_name, last_name, phone')
        .eq('workspace_id', activeWorkspace.id).order('first_name').limit(500),
      supabase.from('workspace_members').select('user_id, full_name')
        .eq('workspace_id', activeWorkspace.id).eq('status', 'active'),
    ]);
    setTodayEvents(evRes.data || []);
    const rawQueue = qRes.data || [];
    const clientIds = Array.from(new Set(rawQueue.map((q: any) => q.client_id).filter(Boolean)));
    let clientMap: Record<string, any> = {};
    if (clientIds.length) {
      const { data: cs } = await supabase.from('clients').select('id, first_name, last_name').in('id', clientIds);
      (cs || []).forEach((c: any) => { clientMap[c.id] = c; });
    }
    setQueue(rawQueue.map((q: any) => ({ ...q, clients: q.client_id ? clientMap[q.client_id] : null })));
    setClients(cRes.data || []);
    setStaff(sRes.data || []);
    setLoading(false);
  }, [activeWorkspace, today]);

  useEffect(() => { load(); }, [load]);

  const reset = () => {
    setMode('new'); setClientId(''); setName(''); setPhone('');
    setServiceNeeded(''); setPriority('NORMAL'); setNotes('');
  };

  const handleSubmit = async () => {
    if (!activeWorkspace || !user) return;
    let firstName = '', lastName = '', selectedClient: any = null;

    if (mode === 'existing') {
      if (!clientId) { toast({ title: 'Select a client', variant: 'destructive' }); return; }
      selectedClient = clients.find(c => c.id === clientId);
      firstName = selectedClient?.first_name || '';
      lastName = selectedClient?.last_name || '';
    } else {
      const trimmed = name.trim();
      if (!trimmed) { toast({ title: 'Enter a client name', variant: 'destructive' }); return; }
      const parts = trimmed.split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || '—';
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('queue_entries').insert({
        workspace_id: activeWorkspace.id,
        client_id: mode === 'existing' ? clientId : null,
        first_name: firstName,
        last_name: lastName,
        phone: mode === 'existing' ? (selectedClient?.phone || null) : (phone.trim() || null),
        service_needed: serviceNeeded.trim() || null,
        priority,
        notes: notes.trim() || null,
        assigned_staff_user_id: null,
        assigned_at: null,
        is_walk_in: true,
        status: 'WAITING',
        queue_date: today,
        source: 'walk_in',
        created_by_user_id: user.id,
      });
      if (error) throw error;
      toast({ title: 'Added to queue' });
      setOpen(false);
      reset();
      load();
    } catch (err: any) {
      toast({ title: 'Failed to add', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: QueueStatus) => {
    const { error } = await supabase.from('queue_entries').update({ status }).eq('id', id);
    if (error) { toast({ title: 'Update failed', description: error.message, variant: 'destructive' }); return; }
    setQueue(q => q.map(e => e.id === id ? { ...e, status } : e));
  };

  const assignStaff = async (id: string, staffUserId: string | null) => {
    const payload: any = {
      assigned_staff_user_id: staffUserId,
      assigned_at: staffUserId ? new Date().toISOString() : null,
    };
    const { error } = await supabase.from('queue_entries').update(payload).eq('id', id);
    if (error) { toast({ title: 'Assignment failed', description: error.message, variant: 'destructive' }); return; }
    setQueue(q => q.map(e => e.id === id ? { ...e, ...payload } : e));
    toast({ title: staffUserId ? 'Staff assigned' : 'Unassigned' });
  };

  const claimSelf = (id: string) => user && assignStaff(id, user.id);

  const staffNameFor = (uid: string | null) => {
    if (!uid) return null;
    const s = staff.find(s => s.user_id === uid);
    return s?.full_name || 'Member';
  };

  const fmtTime = (ts: string | null | undefined) => ts ? format(new Date(ts), 'h:mm a') : null;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const waitMinutes = (ts: string | null | undefined) => {
    if (!ts) return null;
    const m = Math.max(0, Math.floor((now - new Date(ts).getTime()) / 60000));
    return m;
  };
  const waitLabel = (ts: string | null | undefined) => {
    const m = waitMinutes(ts);
    if (m === null) return '';
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m waiting`;
    const h = Math.floor(m / 60); const r = m % 60;
    return `${h}h ${r}m waiting`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading queue...</div></div>;

  const norm = (s: string) => (s || '').toUpperCase();
  const activeQueue = queue.filter(q => ['WAITING', 'IN_PROGRESS', 'IN_SERVICE'].includes(norm(q.status)));
  const resolvedQueue = queue.filter(q => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(norm(q.status)));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Today's Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Walk-in check-in and scheduled sessions for today</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />{format(new Date(), 'EEEE, MMM d')}</Badge>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Walk-In</Button>
        </div>
      </div>

      {/* Walk-in / queue list */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Queue ({activeQueue.length})</h2>
        {activeQueue.length === 0 ? (
          <Card><CardContent className="py-10 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No one in the queue. Click <span className="font-medium">Add Walk-In</span> to add someone.</p>
          </CardContent></Card>
        ) : activeQueue.map((e, i) => {
          const status = (norm(e.status) as QueueStatus);
          const priority = (e.priority as Priority) || 'NORMAL';
          const name = e.clients ? `${e.clients.first_name} ${e.clients.last_name}` : `${e.first_name} ${e.last_name}`;
          const assignedName = staffNameFor(e.assigned_staff_user_id);
          return (
            <Card key={e.id} className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${STATUS_BAR[status] || 'bg-muted'}`} />
              <CardContent className="p-5 pl-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0">
                    <span className="text-base font-bold leading-none">{i + 1}</span>
                    <span className="text-[9px] uppercase tracking-wider text-primary/70 mt-0.5">queue</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row 1: name + status */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight truncate">{name}</h3>
                        {e.is_walk_in && <Badge variant="outline" className="text-[10px] bg-accent/40 border-accent">Walk-In</Badge>}
                      </div>
                      <Badge className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[status]}`}>
                        {STATUS_LABEL[status]}
                      </Badge>
                    </div>

                    {/* Row 2: service + priority */}
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="inline-flex items-center gap-1.5 text-foreground/80">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        {e.service_needed || 'General Service'}
                      </span>
                      <Badge className={`text-[10px] font-medium rounded-full ${PRIORITY_STYLE[priority]}`}>
                        {priority}
                      </Badge>
                      {e.phone && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />{e.phone}
                        </span>
                      )}
                    </div>

                    {/* Row 3: timestamps + assigned */}
                    <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                      <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Added {fmtTime(e.created_at) || '—'}
                        </span>
                        {status === 'WAITING' && (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                            <Hourglass className="h-3 w-3" />{waitLabel(e.created_at)}
                          </span>
                        )}
                        {e.assigned_at && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />Assigned {fmtTime(e.assigned_at)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs ${assignedName ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                          <User className="h-3.5 w-3.5" />
                          {assignedName || 'Unassigned'}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant={assignedName ? 'outline' : 'default'} className="h-8">
                              <UserPlus className="h-3.5 w-3.5 mr-1" />{assignedName ? 'Reassign' : 'Assign'}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="max-h-72 overflow-auto">
                            {user && <DropdownMenuItem onClick={() => claimSelf(e.id)}>Claim (me)</DropdownMenuItem>}
                            {staff.filter(s => s.user_id !== user?.id).map(s => (
                              <DropdownMenuItem key={s.user_id} onClick={() => assignStaff(e.id, s.user_id)}>{s.full_name || 'Member'}</DropdownMenuItem>
                            ))}
                            {e.assigned_staff_user_id && <DropdownMenuItem onClick={() => assignStaff(e.id, null)} className="text-destructive">Unassign</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(['WAITING','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW'] as QueueStatus[]).map(s => (
                              <DropdownMenuItem key={s} onClick={() => updateStatus(e.id, s)}>Mark {STATUS_LABEL[s]}</DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Scheduled sessions */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Scheduled Sessions ({todayEvents.length})</h2>
        {todayEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No sessions scheduled for today.</CardContent></Card>
        ) : todayEvents.map((e, i) => (
          <Card key={e.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-secondary-foreground font-bold text-sm">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{e.clients?.first_name} {e.clients?.last_name}</p>
                <p className="text-xs text-muted-foreground">{e.service_templates?.name || 'General Service'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{e.start_time || '—'}{e.end_time ? ` – ${e.end_time}` : ''}</p>
                <Badge variant="outline" className="text-xs mt-1">{e.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {resolvedQueue.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Resolved ({resolvedQueue.length})</h2>
          {resolvedQueue.map(e => (
            <Card key={e.id} className="opacity-70">
              <CardContent className="p-3 flex items-center gap-4 text-sm">
                <span className="flex-1 truncate">{e.clients ? `${e.clients.first_name} ${e.clients.last_name}` : `${e.first_name} ${e.last_name}`} · {e.service_needed || 'General'}</span>
                <Badge className={`text-xs ${STATUS_STYLE[e.status as QueueStatus]}`}>{STATUS_LABEL[e.status as QueueStatus]}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7">Reopen</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateStatus(e.id, 'WAITING')}>Move to Waiting</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(e.id, 'IN_PROGRESS')}>Mark In Progress</DropdownMenuItem>
                    {(['COMPLETED','CANCELLED','NO_SHOW'] as QueueStatus[]).filter(s => s !== (e.status as QueueStatus)).map(s => (
                      <DropdownMenuItem key={s} onClick={() => updateStatus(e.id, s)}>Mark {STATUS_LABEL[s]}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Walk-In to Queue</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button type="button" variant={mode === 'new' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setMode('new')}>New Walk-In</Button>
              <Button type="button" variant={mode === 'existing' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setMode('existing')}>Existing Client</Button>
            </div>

            {mode === 'existing' ? (
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.first_name} {c.last_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2 sm:col-span-2"><Label>Full Name *</Label><Input value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder="Jane Doe" /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} maxLength={30} placeholder="(555) 123-4567" /></div>
              </div>
            )}

            <div className="space-y-2"><Label>Service Needed</Label><Input value={serviceNeeded} onChange={e => setServiceNeeded(e.target.value)} maxLength={200} placeholder="e.g., Intake, Consultation" /></div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={1000} rows={3} placeholder="Any additional details..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Adding...' : 'Add to Queue'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueuePage;