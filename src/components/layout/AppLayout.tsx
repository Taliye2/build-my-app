import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Briefcase,
  UserSquare2,
  Contact2,
  ShieldCheck,
  Layers,
  Wallet,
  CreditCard,
  BarChart3,
  Users2,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Lock,
  CheckCircle
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrandLogo } from '@/components/BrandLogo';

const SidebarLogo: React.FC = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Link to="/" className="block">
      <BrandLogo variant="sidebar" isCollapsed={isCollapsed} />
    </Link>
  );
};

export const AppLayout: React.FC = () => {
  const { user, signOut, impersonatedWorkspaceId, setImpersonatedWorkspaceId } = useAuth();
  const { workspaces, activeWorkspace, setActiveWorkspaceId, activeMember, isLocked, isTrialActive, trialDaysRemaining, hasBillingAccess, hasAdvancedReporting } = useWorkspace();
  const location = useLocation();

  const isPaid = activeWorkspace?.plan_status === 'active' || activeWorkspace?.access_state === 'ACTIVE_PAID';
  const isPendingPayment = !isPaid && !isTrialActive;

  const showBanner = (activeMember?.role === 'OWNER' || activeMember?.role === 'ADMIN') &&
    !isPaid &&
    isTrialActive &&
    trialDaysRemaining !== null && trialDaysRemaining <= 7 && trialDaysRemaining >= 0;

  const showImpersonationBanner = !!impersonatedWorkspaceId;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', disabled: isPendingPayment },
    { icon: Clock, label: 'Queue', path: '/queue', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Users, label: 'Clients', path: '/clients', disabled: isPendingPayment },
    { icon: UserSquare2, label: 'Providers', path: '/providers', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Contact2, label: 'Contacts', path: '/contacts', disabled: isPendingPayment },
    { icon: ShieldCheck, label: 'Compliance', path: '/compliance', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER', 'READ_ONLY'] },
    { icon: Briefcase, label: 'Services', path: '/services', disabled: isPendingPayment },
    { icon: Layers, label: 'Programs', path: '/programs', disabled: isPendingPayment || !hasAdvancedReporting, roles: ['OWNER', 'ADMIN', 'MANAGER'], plan: 'Scale' },
    { icon: Wallet, label: 'Payroll', path: '/payroll', disabled: isPendingPayment || !hasAdvancedReporting, roles: ['OWNER', 'ADMIN', 'MANAGER'], plan: 'Scale' },
    { icon: CreditCard, label: 'Billing', path: '/billing', disabled: false },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', disabled: isPendingPayment || !hasAdvancedReporting, roles: ['OWNER', 'ADMIN', 'MANAGER'], plan: 'Scale' },
    { icon: Users2, label: 'Team', path: '/team', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: MessageSquare, label: 'Messaging', path: '/messaging', disabled: isPendingPayment },
    { icon: Mail, label: 'Email Templates', path: '/email-templates', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Settings, label: 'Settings', path: '/settings', disabled: isPendingPayment, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
  ];

  const hasRoleAccess = (itemRoles?: string[]) => {
    if (!itemRoles || !activeMember) return true;
    return itemRoles.includes(activeMember.role);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4" style={{ minHeight: '80px' }}>
            <SidebarLogo />
          </SidebarHeader>

          <SidebarContent>
            {/* Workspace Switcher */}
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {activeWorkspace?.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm">{activeWorkspace?.name}</span>
                        </div>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {workspaces.map((ws) => (
                        <DropdownMenuItem
                          key={ws.id}
                          onClick={() => setActiveWorkspaceId(ws.id)}
                          className="flex items-center justify-between"
                        >
                          {ws.name}
                          {ws.id === activeWorkspace?.id && <CheckCircle className="h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Main Menu */}
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item: any) => {
                  const roleAccess = hasRoleAccess(item.roles);
                  const isScaleFeature = item.plan === 'Scale';
                  const isTrialPreview = isTrialActive && isScaleFeature;
                  const planRestricted = !isTrialPreview && item.plan && isScaleFeature && !hasAdvancedReporting;
                  const isDisabled = item.disabled || planRestricted || !roleAccess;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                  return (
                    <SidebarMenuItem key={item.label}>
                      {isDisabled ? (
                        <SidebarMenuButton disabled className="opacity-50">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          {planRestricted && <Lock className="h-3 w-3 ml-auto" />}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.path}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            {isTrialPreview && (
                              <Badge variant="outline" className="ml-auto text-[10px] px-1 py-0">
                                TRIAL
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(user?.user_metadata?.full_name || user?.email || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate">{user?.user_metadata?.full_name || 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate">{activeMember?.role || 'Staff'}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          {showImpersonationBanner && (
            <div className="bg-warning text-warning-foreground text-sm px-4 py-2 flex items-center justify-between">
              <span>Viewing workspace: {activeWorkspace?.name} (Impersonation Mode)</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setImpersonatedWorkspaceId(null);
                  window.location.href = '/admin/organizations';
                }}
              >
                Stop Impersonating
              </Button>
            </div>
          )}

          <header className="h-14 flex items-center border-b border-border/50 px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
          </header>

          {showBanner && (
            <div className="bg-warning/10 border-b border-warning/20 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>
                  {trialDaysRemaining === 0
                    ? "Your free trial ends today. Add payment to avoid interruption."
                    : `Your free trial ends in ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'day' : 'days'}. Add payment to avoid interruption.`}
                </span>
              </div>
              <Button asChild size="sm" variant="default">
                <Link to="/billing/plan">Choose a plan</Link>
              </Button>
            </div>
          )}

          <main className="flex-1 p-6">
            {isLocked && !location.pathname.startsWith('/billing') && !location.pathname.startsWith('/logout') ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your trial has ended</h2>
                <p className="text-muted-foreground mb-6">Choose a plan to continue using Kafiskey.</p>
                <div className="flex gap-3">
                  <Button asChild>
                    <Link to="/billing/plan?interval=month">Choose Monthly</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/billing/plan?interval=year">Choose Yearly</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
