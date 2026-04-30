import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Send, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content_body: string;
  trigger_type: string;
  stats: { opens: number; clicks: number; sent?: number };
  created_at: string;
}

const AdminCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', content_body: '', trigger_type: 'Manual' });

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('system_campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.content_body) {
      toast.error('Please fill in all required fields');
      return;
    }
    const { error } = await supabase.from('system_campaigns').insert({
      name: form.name,
      subject: form.subject,
      content_body: form.content_body,
      trigger_type: form.trigger_type,
    });
    if (error) {
      toast.error('Failed to create campaign');
      console.error(error);
    } else {
      toast.success('Campaign created');
      setForm({ name: '', subject: '', content_body: '', trigger_type: 'Manual' });
      setDialogOpen(false);
      fetchCampaigns();
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading campaigns...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Campaigns & Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">Send special offers and promotions to your customers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Spring Special Offer" />
              </div>
              <div>
                <Label>Subject Line</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. 🎉 20% Off This Month Only!" />
              </div>
              <div>
                <Label>Trigger</Label>
                <Select value={form.trigger_type} onValueChange={v => setForm(f => ({ ...f, trigger_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Trial_End_3_Days">Trial Ending (3 days)</SelectItem>
                    <SelectItem value="Trial_Expired">Trial Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea rows={6} value={form.content_body} onChange={e => setForm(f => ({ ...f, content_body: e.target.value }))} placeholder="Write your campaign email content here..." />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opens</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.subject}</TableCell>
                  <TableCell><Badge variant="outline">{c.trigger_type}</Badge></TableCell>
                  <TableCell className="text-sm">{c.stats?.sent || 0}</TableCell>
                  <TableCell className="text-sm">{c.stats?.opens || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {campaigns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No campaigns yet. Create your first one!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampaignsPage;