import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Building, Mail, MapPin } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { activeWorkspace, refreshWorkspaces } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    email_sender_name: '',
    email_sender_address: '',
    email_reply_to: '',
    is_check_in_enabled: false,
  });

  useEffect(() => {
    if (!activeWorkspace) return;
    setForm({
      name: activeWorkspace.name || '',
      address_line_1: activeWorkspace.address_line_1 || '',
      address_line_2: activeWorkspace.address_line_2 || '',
      city: activeWorkspace.city || '',
      state: activeWorkspace.state || '',
      zip_code: activeWorkspace.zip_code || '',
      country: activeWorkspace.country || '',
      email_sender_name: activeWorkspace.email_sender_name || '',
      email_sender_address: activeWorkspace.email_sender_address || '',
      email_reply_to: activeWorkspace.email_reply_to || '',
      is_check_in_enabled: activeWorkspace.is_check_in_enabled || false,
    });
  }, [activeWorkspace]);

  const handleSave = async () => {
    if (!activeWorkspace) return;
    setSaving(true);
    const { error } = await supabase.from('workspaces').update(form).eq('id', activeWorkspace.id);
    if (error) toast.error('Failed to save settings');
    else { toast.success('Settings saved'); refreshWorkspaces(); }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-semibold">Settings</h1><p className="text-sm text-muted-foreground mt-1">Configure your workspace settings</p></div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4" />Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Workspace Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />Address</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Address Line 1</Label><Input value={form.address_line_1} onChange={e => setForm(f => ({ ...f, address_line_1: e.target.value }))} /></div>
          <div><Label>Address Line 2</Label><Input value={form.address_line_2} onChange={e => setForm(f => ({ ...f, address_line_2: e.target.value }))} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
            <div><Label>ZIP</Label><Input value={form.zip_code} onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))} /></div>
          </div>
          <div><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" />Email Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Sender Name</Label><Input value={form.email_sender_name} onChange={e => setForm(f => ({ ...f, email_sender_name: e.target.value }))} placeholder="Your Organization" /></div>
          <div><Label>Sender Email</Label><Input type="email" value={form.email_sender_address} onChange={e => setForm(f => ({ ...f, email_sender_address: e.target.value }))} placeholder="noreply@example.com" /></div>
          <div><Label>Reply-To</Label><Input type="email" value={form.email_reply_to} onChange={e => setForm(f => ({ ...f, email_reply_to: e.target.value }))} placeholder="support@example.com" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Features</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div><Label>Walk-in Check-In</Label><p className="text-xs text-muted-foreground">Enable public check-in page for walk-in clients</p></div>
            <Switch checked={form.is_check_in_enabled} onCheckedChange={v => setForm(f => ({ ...f, is_check_in_enabled: v }))} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default SettingsPage;