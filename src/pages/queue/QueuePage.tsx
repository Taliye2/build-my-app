import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

const QueuePage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    supabase.from('service_events').select('*, clients(first_name, last_name), service_templates(name)')
      .eq('workspace_id', activeWorkspace.id).eq('date', today).order('start_time')
      .then(({ data }) => { setTodayEvents(data || []); setLoading(false); });
  }, [activeWorkspace]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading queue...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Today's Queue</h1><p className="text-sm text-muted-foreground mt-1">Walk-in check-in and scheduled sessions for today</p></div>
        <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />{format(new Date(), 'EEEE, MMM d')}</Badge>
      </div>

      {todayEvents.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No sessions scheduled</h3>
          <p className="text-sm text-muted-foreground">There are no service events scheduled for today.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {todayEvents.map((e, i) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm">{i + 1}</div>
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
        </div>
      )}
    </div>
  );
};

export default QueuePage;