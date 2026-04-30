import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('staff_profiles').select('*').eq('id', id).single()
      .then(({ data }) => { setProvider(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!provider) return <div className="text-center py-12"><p className="text-muted-foreground">Provider not found.</p><Button asChild variant="outline" className="mt-4"><Link to="/providers">Back</Link></Button></div>;

  const name = provider.full_name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Unnamed';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link to="/providers"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-semibold">{name}</h1>
          <p className="text-sm text-muted-foreground">{provider.title || 'Service Provider'}</p>
        </div>
        <Badge className="ml-auto" variant={provider.active !== false ? 'default' : 'secondary'}>{provider.active !== false ? 'Active' : 'Inactive'}</Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {provider.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{provider.email}</div>}
            {(provider.phone || provider.phone_number) && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{provider.phone || provider.phone_number}</div>}
            {provider.address && <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{provider.address}</div>}
            {!provider.email && !provider.phone && !provider.phone_number && <p className="text-sm text-muted-foreground">No contact info on file.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground block">Language</span>{provider.language || '—'}</div>
              <div><span className="text-muted-foreground block">Contact Method</span>{provider.preferred_contact_method || '—'}</div>
              <div><span className="text-muted-foreground block">Emergency Contact</span>{provider.emergency_contact_name || '—'}</div>
              <div><span className="text-muted-foreground block">Emergency Phone</span>{provider.emergency_contact_phone || '—'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderProfilePage;