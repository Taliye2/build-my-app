import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Building } from 'lucide-react';

const ContactProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('contacts').select('*').eq('id', id).single().then(({ data }) => { setContact(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!contact) return <div className="text-center py-12"><p className="text-muted-foreground">Contact not found.</p><Button asChild variant="outline" className="mt-4"><Link to="/contacts">Back</Link></Button></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link to="/contacts"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div><h1 className="text-2xl font-semibold">{contact.first_name} {contact.last_name}</h1><p className="text-sm text-muted-foreground">{contact.relationship || 'Contact'}</p></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Contact Info</CardTitle></CardHeader><CardContent className="space-y-3">
          {contact.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{contact.email}</div>}
          {contact.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{contact.phone}</div>}
          {contact.organization && <div className="flex items-center gap-2 text-sm"><Building className="h-4 w-4 text-muted-foreground" />{contact.organization}</div>}
          {!contact.email && !contact.phone && <p className="text-sm text-muted-foreground">No contact info on file.</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Address</span>{contact.address || '—'}</div>
            <div><span className="text-muted-foreground block">Language</span>{contact.language || '—'}</div>
            <div><span className="text-muted-foreground block">Contact Method</span>{contact.preferred_contact_method || '—'}</div>
            <div><span className="text-muted-foreground block">DOB</span>{contact.dob ? new Date(contact.dob).toLocaleDateString() : '—'}</div>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
};

export default ContactProfilePage;