
"use client";

// import type { Metadata } from 'next'; // Metadata can be an issue with "use client" at root
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, CircleUserRound, LogOut, FileText, LayoutDashboard, ShieldAlert, Loader2, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

interface AppContentProps {
  children: ReactNode;
}

const AppContent: React.FC<AppContentProps> = ({ children }) => {
  const { toggleSidebar, state: sidebarState, isMobile, openMobile } = useSidebar();
  const currentPathname = usePathname();
  const router = useRouter();
  const { appUser, userAppRole, isLoadingAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  React.useEffect(() => {
    if (!isLoadingAuth) {
      if (!appUser && currentPathname !== '/login') {
        router.replace('/login');
      } else if (appUser && currentPathname === '/login') {
        if (userAppRole === 'admin') {
          router.replace('/admin/dashboard');
        } else if (userAppRole === 'vendedor') {
          router.replace('/dashboard/seller');
        } else {
          router.replace('/');
        }
      }
    }
  }, [isLoadingAuth, appUser, userAppRole, currentPathname, router]);

  if (isLoadingAuth && currentPathname !== '/login') { 
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Carregando autenticação...</p>
      </div>
    );
  }
  
  if (currentPathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
        {/* SidebarHeader REMOVIDO */}
        <SidebarContent>
          <SidebarMenu>
             <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton isActive={currentPathname === '/'} tooltip="Calculadora de Economia">
                  <Calculator />
                  Calculadora
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/proposal-generator">
                <SidebarMenuButton isActive={currentPathname === '/proposal-generator'} tooltip="Gerador de Proposta">
                  <FileText />
                  Proposta
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {userAppRole === 'vendedor' && (
              <SidebarMenuItem>
                <Link href="/dashboard/seller">
                  <SidebarMenuButton isActive={currentPathname === '/dashboard/seller'} tooltip="Meu Painel">
                    <LayoutDashboard />
                    Meu Painel
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <Link href="/crm">
                <SidebarMenuButton tooltip="Gestão de Clientes" isActive={currentPathname === '/crm'}>
                  <UsersRound />
                  CRM
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/carteira">
                <SidebarMenuButton tooltip="Minha Carteira" isActive={currentPathname === '/carteira'}>
                  <Wallet />
                  Carteira
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {userAppRole === 'admin' && (
              <SidebarMenuItem>
                <Link href="/admin/dashboard">
                  <SidebarMenuButton isActive={currentPathname === '/admin/dashboard'} tooltip="Painel Admin">
                    <ShieldAlert />
                    Painel Admin
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <Link href="/ranking">
                <SidebarMenuButton tooltip="Ranking de Performance" isActive={currentPathname === '/ranking'}>
                  <BarChart3 />
                  Ranking
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/career-plan">
                <SidebarMenuButton tooltip="Planejamento de Carreira" isActive={currentPathname === '/career-plan' || currentPathname.startsWith('/career-plan/')}>
                  <Rocket />
                  Plano de Carreira
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/profile">
                <SidebarMenuButton tooltip="Meu Perfil" isActive={currentPathname === '/profile'}>
                  <CircleUserRound />
                  Perfil
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          <TooltipProvider delayDuration={0}>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className={cn(
                              "w-full flex items-center gap-2 p-2 text-left text-sm",
                              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              (sidebarState === 'expanded' || openMobile) ? "justify-start" : "justify-center",
                              (sidebarState === 'collapsed' && !isMobile) && "size-8 p-0"
                          )}
                          aria-label="Sair"
                      >
                          <LogOut className="h-5 w-5 flex-shrink-0" />
                          <span className={cn( (sidebarState === 'collapsed' && !isMobile) && "hidden")}>
                              Sair
                          </span>
                      </Button>
                  </TooltipTrigger>
                  {(sidebarState === 'collapsed' && !isMobile) && (
                      <TooltipContent side="right" align="center">
                          <p>Sair</p>
                      </TooltipContent>
                  )}
              </Tooltip>
          </TooltipProvider>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/Whisk_7171a56086%20(2).svg"
            alt="Blurred Background"
            fill
            sizes="100vw"
            style={{objectFit: "cover", objectPosition: "center"}}
            className="filter blur-lg"
            data-ai-hint="abstract background"
            priority
          />
        </div>
        
        <header className="sticky top-0 z-10 flex h-14 items-center gap-x-4 border-b bg-background/70 backdrop-blur-md px-4 sm:px-6 py-2">
          {appUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full h-9 w-9 p-0 text-foreground hover:bg-accent hover:text-accent-foreground -ml-1"
              aria-label="Toggle sidebar"
            >
              {isMobile ? (
                <Menu className="h-5 w-5" />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appUser.photoURL || undefined} alt={appUser.displayName || "Usuário"} data-ai-hint="user avatar small" />
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {appUser.displayName ? appUser.displayName.substring(0,2).toUpperCase() : (appUser.email ? appUser.email.substring(0,2).toUpperCase() : "U")}
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          )}
          {(!isMobile || (isMobile && !openMobile)) && (
            <h1 className={cn(
                "text-lg font-semibold text-primary truncate flex-grow",
                (!isMobile && sidebarState === 'collapsed') ? "hidden" : "block" 
              )}
            >
              BrasilVis Energia
            </h1>
          )}
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>BrasilVis App</title>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {pathname === '/login' ? (
            children 
          ) : (
            <SidebarProvider defaultOpen={false}> 
              <AppContent>{children}</AppContent>
            </SidebarProvider>
          )}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

