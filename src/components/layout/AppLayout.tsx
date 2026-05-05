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
  CheckCircle,
  Shield
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
  const { workspaces, activeWorkspace, setActiveWorkspaceId, activeMember } = useWorkspace();
  const location = useLocation();

  const showImpersonationBanner = !!impersonatedWorkspaceId;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Clock, label: 'Queue', path: '/queue', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: UserSquare2, label: 'Providers', path: '/providers', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Contact2, label: 'Contacts', path: '/contacts' },
    { icon: ShieldCheck, label: 'Compliance', path: '/compliance', roles: ['OWNER', 'ADMIN', 'MANAGER', 'READ_ONLY'] },
    { icon: Briefcase, label: 'Services', path: '/services' },
    { icon: Layers, label: 'Programs', path: '/programs', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Wallet, label: 'Payroll', path: '/payroll', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Users2, label: 'Team', path: '/team', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: MessageSquare, label: 'Messaging', path: '/messaging' },
    { icon: Mail, label: 'Email Templates', path: '/email-templates', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
  ];

  const { isSuperAdmin } = useAuth();

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
          <SidebarHeader className="p-4" style={{ minHeight: '140px' }}>
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
                  const isDisabled = !roleAccess;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                  return (
                    <SidebarMenuItem key={item.label}>
                      {isDisabled ? (
                        <SidebarMenuButton disabled className="opacity-50">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.path}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            {isSuperAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith('/admin')}>
                      <Link to="/admin">
                        <Shield className="h-4 w-4" />
                        <span>Admin Portal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}
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
            {isSuperAdmin && (
              <div className="ml-auto">
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    Switch to Super Admin
                  </Link>
                </Button>
              </div>
            )}
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
