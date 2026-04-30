import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserSquare2 } from 'lucide-react';

const ProvidersPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    supabase.from('staff_profiles').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false })
      .then(({ data }) => { setProviders(data || []); setLoading(false); });
  }, [activeWorkspace]);

  const filtered = providers.filter(p =>
    `${p.first_name || ''} ${p.last_name || ''} ${p.full_name || ''} ${p.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading providers...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Providers</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage service providers and staff credentials</p>
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
    </div>
  );
};

export default ProvidersPage;