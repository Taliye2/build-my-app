import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, Shield, Users, BarChart3, Lock, Check } from 'lucide-react';

// Re-export real page components
export { default as ClientListPage } from '@/pages/clients/ClientListPage';
export { default as ClientProfilePage } from '@/pages/clients/ClientProfilePage';
export { default as ProvidersPage } from '@/pages/providers/ProvidersPage';
export { default as ProviderProfilePage } from '@/pages/providers/ProviderProfilePage';
export { default as ContactsPage } from '@/pages/contacts/ContactsPage';
export { default as ContactProfilePage } from '@/pages/contacts/ContactProfilePage';
export { default as ServicesPage } from '@/pages/services/ServicesPage';
export { default as BillingPage } from '@/pages/billing/BillingPage';
export { default as StripePlanPage } from '@/pages/billing/StripePlanPage';
export { default as PayrollPage } from '@/pages/payroll/PayrollPage';
export { default as AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
export { default as TeamPage } from '@/pages/team/TeamPage';
export { default as MessagingPage } from '@/pages/messaging/MessagingPage';
export { default as EmailTemplatesPage } from '@/pages/email/EmailTemplatesPage';
export { default as SettingsPage } from '@/pages/settings/SettingsPage';
export { default as CompliancePage } from '@/pages/compliance/CompliancePage';
export { default as ProgramsPage } from '@/pages/programs/ProgramsPage';
export { default as QueuePage } from '@/pages/queue/QueuePage';

// Service Record Editor (simple placeholder – editing is context-specific)
export const ServiceRecordEditor: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <div><h1 className="text-2xl font-semibold">Service Record</h1><p className="text-sm text-muted-foreground mt-1">Document service delivery details</p></div>
    <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Select a service event to begin documentation.</p></CardContent></Card>
  </div>
);

// Launchpad
export const LaunchpadPage: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <div><h1 className="text-2xl font-semibold">Launchpad</h1><p className="text-sm text-muted-foreground mt-1">Guided implementation setup for your workspace</p></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: 'Add Team Members', desc: 'Invite your staff to collaborate', link: '/team', done: false },
        { title: 'Add Your First Client', desc: 'Start managing client records', link: '/clients', done: false },
        { title: 'Configure Services', desc: 'Set up service templates', link: '/services', done: false },
        { title: 'Organization Settings', desc: 'Complete your workspace profile', link: '/settings', done: false },
        { title: 'HIPAA Compliance', desc: 'Review and acknowledge requirements', link: '/compliance', done: false },
        { title: 'Invite Your Team', desc: 'Generate invite links for staff', link: '/team', done: false },
      ].map(item => (
        <Card key={item.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-success border-success' : 'border-border'}`}>
                {item.done && <Check className="h-3 w-3 text-success-foreground" />}
              </div>
              <div>
                <Link to={item.link} className="font-medium text-sm hover:text-primary transition-colors">{item.title}</Link>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Onboarding
export const OnboardingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Please enter an organization name'); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc('create_tenant_with_owner_membership', { _name: name.trim() });
    if (error) {
      toast.error(error.message || 'Failed to create organization');
      setLoading(false);
      return;
    }
    toast.success('Organization created! Redirecting...');
    setTimeout(() => window.location.href = '/', 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><BrandLogo variant="auth" /></div>
          <CardTitle>Create Your Workspace</CardTitle>
          <CardDescription>Set up your organization to get started with Kafiskey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Organization Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunrise Behavioral Health" onKeyDown={e => e.key === 'Enter' && handleCreate()} /></div>
          <Button onClick={handleCreate} className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Organization'}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Reset Password
export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else { toast.success('Password updated successfully!'); navigate('/auth'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><CardTitle>Reset Password</CardTitle><CardDescription>Enter your new password below</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div><Label>New Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required placeholder="Minimum 8 characters" /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Landing Page
export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <BrandLogo variant="navbar" />
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost"><Link to="/auth">Sign In</Link></Button>
          <Button asChild><Link to="/auth?tab=register">Get Started</Link></Button>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
        Service Operations,<br /><span className="text-brand-gradient">Simplified</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Kafiskey is the all-in-one platform for managing clients, tracking services, processing payroll, and staying HIPAA-compliant — built for organizations that deliver hourly and session-based care.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild size="lg"><Link to="/auth?tab=register">Start Free Trial <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/auth">Sign In</Link></Button>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: 'Client Management', desc: 'Track clients, contacts, documents, and service history in one place.' },
          { icon: BarChart3, title: 'Analytics & Reporting', desc: 'Real-time dashboards, billing reports, and operational insights.' },
          { icon: Shield, title: 'HIPAA Compliant', desc: 'Built-in audit logging, role-based access, and data security controls.' },
        ].map(f => (
          <Card key={f.title} className="text-center">
            <CardContent className="pt-8 pb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><f.icon className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Kafiskey. All rights reserved.</span>
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
      </div>
    </footer>
  </div>
);

// Privacy
export const PrivacyPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center"><BrandLogo variant="navbar" /></div>
    </header>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>At Kafiskey, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        <h2 className="text-lg font-semibold text-foreground mt-6">Information We Collect</h2>
        <p>We collect information you provide directly, including account details, organization information, and client data you enter into the platform.</p>
        <h2 className="text-lg font-semibold text-foreground mt-6">How We Use Information</h2>
        <p>Your data is used solely to provide and improve our services. We do not sell personal information to third parties.</p>
        <h2 className="text-lg font-semibold text-foreground mt-6">Data Security</h2>
        <p>We implement industry-standard security measures including encryption, role-based access controls, and HIPAA-compliant data handling practices.</p>
        <h2 className="text-lg font-semibold text-foreground mt-6">Contact Us</h2>
        <p>If you have questions about this policy, please contact us at privacy@kafiskey.com.</p>
      </div>
    </div>
  </div>
);

// Logout
export const LogoutPage: React.FC = () => {
  const { signOut } = useAuth();
  React.useEffect(() => { signOut(); }, [signOut]);
  return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Signing out...</div></div>;
};

// Check-in
export const CheckInPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4"><BrandLogo variant="auth" /></div>
        <CardTitle>Walk-In Check-In</CardTitle>
        <CardDescription>Please check in for your appointment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Label>First Name</Label><Input placeholder="Enter your first name" /></div>
        <div><Label>Last Name</Label><Input placeholder="Enter your last name" /></div>
        <Button className="w-full">Check In</Button>
      </CardContent>
    </Card>
  </div>
);

// QuickBooks Callback
export const QuickBooksCallbackPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="w-full max-w-sm">
      <CardContent className="py-8 text-center">
        <div className="animate-pulse text-muted-foreground mb-2">Processing QuickBooks authorization...</div>
        <p className="text-xs text-muted-foreground">You will be redirected automatically.</p>
      </CardContent>
    </Card>
  </div>
);
