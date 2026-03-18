import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from '@/contexts/WorkspaceContext';
import { AuthPage } from '@/pages/AuthPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireRole } from '@/components/layout/RequireRole';
import { DashboardPage } from '@/pages/DashboardPage';
import {
  ClientListPage,
  ClientProfilePage,
  ProvidersPage,
  ProviderProfilePage,
  ContactsPage,
  ContactProfilePage,
  ServicesPage,
  ServiceRecordEditor,
  PayrollPage,
  BillingPage,
  StripePlanPage,
  LaunchpadPage,
  AnalyticsPage,
  TeamPage,
  MessagingPage,
  EmailTemplatesPage,
  SettingsPage,
  CompliancePage,
  ProgramsPage,
  QueuePage,
  OnboardingPage,
  ResetPasswordPage,
  LandingPage,
  PrivacyPage,
  LogoutPage,
  CheckInPage,
  QuickBooksCallbackPage,
} from '@/pages/PlaceholderPages';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as ToasterUI } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">{message}</div>
  </div>
);

const BootstrapGate: React.FC<{ children: React.ReactNode; requireAuth?: boolean }> = ({ children, requireAuth = true }) => {
  const { loading: authLoading, session } = useAuth();
  const { loading: workspaceLoading } = useWorkspace();

  if (authLoading || workspaceLoading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !session) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const WorkspaceRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWorkspace } = useWorkspace();
  const { isSuperAdmin } = useAuth();
  const location = useLocation();

  if (!activeWorkspace) return <Navigate to="/onboarding" replace />;

  const isPaid = isSuperAdmin || ['active', 'trialing', 'trial'].includes(activeWorkspace.plan_status || '');
  const isBillingPlanPage = location.pathname === '/billing/plan';

  if (!isPaid && !isBillingPlanPage) {
    return <Navigate to="/billing/plan" replace />;
  }

  return <>{children}</>;
};

const OnboardingRoute: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  if (activeWorkspace) return <Navigate to="/" replace />;
  return <OnboardingPage />;
};

const HomeRoute: React.FC = () => {
  const { session } = useAuth();
  if (!session) return <LandingPage />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ToasterUI />
        <BrowserRouter>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/check-in/:slug" element={<CheckInPage />} />
                <Route path="/quickbooks/callback" element={<QuickBooksCallbackPage />} />

                {/* Onboarding */}
                <Route path="/onboarding" element={
                  <ProtectedRoute><OnboardingRoute /></ProtectedRoute>
                } />

                {/* App routes with layout */}
                <Route element={
                  <BootstrapGate>
                    <WorkspaceRoute>
                      <AppLayout />
                    </WorkspaceRoute>
                  </BootstrapGate>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="/queue" element={<QueuePage />} />
                  <Route path="/clients" element={<ClientListPage />} />
                  <Route path="/clients/:id" element={<ClientProfilePage />} />
                  <Route path="/providers" element={
                    <RequireRole allowedRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                      <ProvidersPage />
                    </RequireRole>
                  } />
                  <Route path="/providers/:id" element={<ProviderProfilePage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/contacts/:id" element={<ContactProfilePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/record/:id" element={<ServiceRecordEditor />} />
                  <Route path="/compliance" element={<CompliancePage />} />
                  <Route path="/programs" element={<ProgramsPage />} />
                  <Route path="/payroll" element={
                    <RequireRole allowedRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                      <PayrollPage />
                    </RequireRole>
                  } />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/billing/plan" element={<StripePlanPage />} />
                  <Route path="/billing/launchpad" element={<LaunchpadPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/team" element={
                    <RequireRole allowedRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                      <TeamPage />
                    </RequireRole>
                  } />
                  <Route path="/messaging" element={<MessagingPage />} />
                  <Route path="/email-templates" element={<EmailTemplatesPage />} />
                  <Route path="/settings" element={
                    <RequireRole allowedRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                      <SettingsPage />
                    </RequireRole>
                  } />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
