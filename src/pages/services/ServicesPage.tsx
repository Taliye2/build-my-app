import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const ServicesPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [templates, setTemplates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    Promise.all([
      supabase.from('service_templates').select('*').eq('workspace_id', activeWorkspace.id).order('name'),
      supabase.from('service_events').select('*, clients(first_name, last_name), service_templates(name)').eq('workspace_id', activeWorkspace.id).order('date', { ascending: false }).limit(25),
    ]).then(([tRes, eRes]) => {
      setTemplates(tRes.data || []);
      setEvents(eRes.data || []);
      setLoading(false);
    });
  }, [activeWorkspace]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading services...</div></div>;

  const filteredEvents = events.filter(e =>
    `${e.clients?.first_name || ''} ${e.clients?.last_name || ''} ${e.service_templates?.name || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Services</h1><p className="text-sm text-muted-foreground mt-1">Service templates and recent delivery records</p></div>

      {/* Templates */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Service Templates</h2>
        {templates.length === 0 ? (
          <Card><CardContent className="py-8 text-center"><Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No service templates configured yet.</p></CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <Card key={t.id}><CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{t.name}</span>
                  <Badge variant={t.active !== false ? 'default' : 'secondary'} className="text-[10px]">{t.active !== false ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.description || 'No description'}</p>
                {t.default_rate && <p className="text-xs text-muted-foreground mt-1">Rate: ${Number(t.default_rate).toFixed(2)}/hr</p>}
              </CardContent></Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Service Events</h2>
        <div className="relative max-w-sm mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Client</TableHead><TableHead>Service</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredEvents.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.clients?.first_name} {e.clients?.last_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.service_templates?.name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.date ? new Date(e.date).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.start_time && e.end_time ? `${e.start_time}–${e.end_time}` : '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.status}</Badge></TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No service events found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </div>
  );
};

export default ServicesPage;