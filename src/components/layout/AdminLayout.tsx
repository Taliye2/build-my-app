import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  CreditCard,
  Users,
  LogOut,
  Shield,
  ArrowLeft,
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Building2, label: 'Organizations', path: '/admin/organizations' },
  { icon: Megaphone, label: 'Campaigns', path: '/admin/campaigns' },
  { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
  { icon: Users, label: 'Leads', path: '/admin/leads' },
];

export const AdminLayout: React.FC = () => {
  const { isSuperAdmin, signOut, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-destructive/10 shrink-0">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div className="overflow-hidden">
                <h2 className="font-semibold text-sm truncate">Kafiskey Admin</h2>
                <p className="text-xs text-muted-foreground truncate">Super Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to App</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">ADMIN</span>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};