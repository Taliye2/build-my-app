import React from 'react';

const createPlaceholderPage = (title: string, description: string) => {
  const Page: React.FC = () => (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="glass-card rounded-lg p-8 text-center">
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </div>
  );
  Page.displayName = `${title.replace(/\s/g, '')}Page`;
  return Page;
};

// Client pages
export const ClientListPage = createPlaceholderPage('Clients', 'Manage your client roster and profiles.');
export const ClientProfilePage = createPlaceholderPage('Client Profile', 'View and manage client details.');

// Provider pages
export const ProvidersPage = createPlaceholderPage('Providers', 'Manage service providers and staff.');
export const ProviderProfilePage = createPlaceholderPage('Provider Profile', 'View provider details and credentials.');

// Contact pages
export const ContactsPage = createPlaceholderPage('Contacts', 'Manage external contacts and relationships.');
export const ContactProfilePage = createPlaceholderPage('Contact Profile', 'View contact details.');

// Services
export const ServicesPage = createPlaceholderPage('Services', 'Configure service templates and scheduling.');
export const ServiceRecordEditor = createPlaceholderPage('Service Record', 'Document service delivery.');

// Billing
export const BillingPage = createPlaceholderPage('Billing', 'Manage invoices and billing items.');
export const StripePlanPage = createPlaceholderPage('Choose a Plan', 'Select your subscription plan.');
export const LaunchpadPage = createPlaceholderPage('Launchpad', 'Guided implementation setup.');

// Payroll
export const PayrollPage = createPlaceholderPage('Payroll', 'Process payroll for service providers.');

// Analytics
export const AnalyticsPage = createPlaceholderPage('Analytics', 'View workspace performance and insights.');

// Team
export const TeamPage = createPlaceholderPage('Team', 'Manage workspace members and invitations.');

// Messaging
export const MessagingPage = createPlaceholderPage('Messaging', 'Internal workspace messaging.');

// Email Templates
export const EmailTemplatesPage = createPlaceholderPage('Email Templates', 'Create and manage email templates.');

// Settings
export const SettingsPage = createPlaceholderPage('Settings', 'Configure workspace settings and preferences.');

// Compliance
export const CompliancePage = createPlaceholderPage('Compliance', 'HIPAA compliance and audit tools.');

// Programs
export const ProgramsPage = createPlaceholderPage('Programs', 'Manage service programs and enrollments.');

// Queue
export const QueuePage = createPlaceholderPage('Queue', 'Walk-in check-in queue management.');

// Scheduling
export const SchedulingPage = createPlaceholderPage('Scheduling', 'Manage appointments and recurring schedules.');

// Onboarding
export const OnboardingPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="glass-card rounded-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-semibold mb-2">Welcome to Kafiskey</h1>
      <p className="text-muted-foreground mb-6">Let's set up your workspace.</p>
      <p className="text-sm text-muted-foreground">Onboarding flow coming soon.</p>
    </div>
  </div>
);

// Reset Password
export const ResetPasswordPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="glass-card rounded-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
      <p className="text-muted-foreground">Password reset flow coming soon.</p>
    </div>
  </div>
);

// Landing
export const LandingPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Kafiskey</h1>
      <p className="text-lg text-muted-foreground">Universal Service Operations Platform</p>
    </div>
  </div>
);

// Privacy
export const PrivacyPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="glass-card rounded-lg p-8 max-w-2xl w-full">
      <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground">Privacy policy content coming soon.</p>
    </div>
  </div>
);

// Logout
export const LogoutPage: React.FC = () => {
  React.useEffect(() => {
    window.location.href = '/auth';
  }, []);
  return null;
};

// Check-in
export const CheckInPage = createPlaceholderPage('Check In', 'Public walk-in check-in page.');

// QuickBooks Callback
export const QuickBooksCallbackPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Processing QuickBooks authorization...</div>
  </div>
);
