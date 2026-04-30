import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, ArrowUpDown } from 'lucide-react';

interface Org {
  id: string;
  name: string;
  plan_status: string | null;
  plan_key: string | null;
  trial_start_date: string | null;
  created_at: string;
  access_state: string | null;
  last_activity: string | null;
}

const AdminOrganizationsPage: React.FC = () => {
  const { setImpersonatedWorkspaceId } = useAuth();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'name' | 'created_at'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchOrgs = async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('id, name, plan_status, plan_key, trial_start_date, created_at, access_state, last_activity')
        .order(sortField, { ascending: sortDir === 'asc' });

      if (!error && data) setOrgs(data);
      setLoading(false);
    };
    fetchOrgs();
  }, [sortField, sortDir]);

  const getTrialDaysLeft = (trialStart: string | null) => {
    if (!trialStart) return null;
    const elapsed = Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - elapsed);
  };

  const getStatusBadge = (org: Org) => {
    if (org.plan_status === 'active') return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    if (org.access_state === 'TRIAL_EXPIRED_LOCKED') return <Badge variant="destructive">Expired</Badge>;
    if (org.plan_status === 'trialing' || org.plan_status === 'trial') {
      const days = getTrialDaysLeft(org.trial_start_date);
      return <Badge variant="outline" className="text-warning border-warning/30">Trial ({days}d)</Badge>;
    }
    return <Badge variant="secondary">{org.plan_status || 'Unknown'}</Badge>;
  };

  const filtered = orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  const toggleSort = (field: 'name' | 'created_at') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleImpersonate = (orgId: string) => {
    setImpersonatedWorkspaceId(orgId);
    window.location.href = '/';
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading organizations...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
        <p className="text-sm text-muted-foreground mt-1">All registered workspaces and their subscription status</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('created_at')}>
                  <span className="flex items-center gap-1">Created <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{getStatusBadge(org)}</TableCell>
                  <TableCell><span className="capitalize text-sm">{org.plan_key || 'free'}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(org.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {org.last_activity ? new Date(org.last_activity).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => handleImpersonate(org.id)} title="View as this workspace">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No organizations found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganizationsPage;