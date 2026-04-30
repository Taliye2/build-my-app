import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from('clients').select('*').eq('id', id).single();
      setClient(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading profile...</div></div>;
  if (!client) return <div className="text-center py-12"><p className="text-muted-foreground">Client not found.</p><Button asChild variant="outline" className="mt-4"><Link to="/clients">Back to Clients</Link></Button></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link to="/clients"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-semibold">{client.first_name} {client.last_name}</h1>
          <p className="text-sm text-muted-foreground">{client.preferred_name ? `"${client.preferred_name}"` : 'Client Profile'}</p>
        </div>
        <Badge className="ml-auto" variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>{client.status}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {client.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{client.email}</div>}
            {client.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{client.phone}</div>}
            {(client.street_address || client.city) && (
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{[client.street_address, client.city, client.state, client.zip_code].filter(Boolean).join(', ')}</div>
            )}
            {client.dob && <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />DOB: {new Date(client.dob).toLocaleDateString()}</div>}
            {client.date_joined && <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" />Joined: {new Date(client.date_joined).toLocaleDateString()}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Emergency Contact</CardTitle></CardHeader>
          <CardContent>
            {client.emergency_contact_name ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{client.emergency_contact_name}</p>
                <p className="text-sm text-muted-foreground">{client.emergency_contact_phone || 'No phone listed'}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency contact on file.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground block">Case Number</span><span>{client.case_number || '—'}</span></div>
              <div><span className="text-muted-foreground block">Language</span><span>{client.language_preference || '—'}</span></div>
              <div><span className="text-muted-foreground block">Contact Method</span><span>{client.preferred_contact_method || '—'}</span></div>
              <div><span className="text-muted-foreground block">Tags</span><span>{client.tags?.length ? client.tags.join(', ') : '—'}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfilePage;