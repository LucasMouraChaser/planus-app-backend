
"use client";

// import type { Metadata } from 'next'; // Metadata can be an issue with "use client" at root
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
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
import React, { ReactNode } from 'react'; // Removed useState, useEffect from here
import { signOut } from 'firebase/auth'; // User type from firebase/auth
import { auth } from '@/lib/firebase';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, CircleUserRound, LogOut, FileText, Menu, LayoutDashboard, ShieldAlert, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Import AuthProvider and useAuth

// Metadata can still be defined but might not be used if the whole component is client-side
// export const metadata: Metadata = {
//   title: 'Energisa Invoice Editor',
//   description: 'Editable Energisa Invoice',
// };

interface AppContentProps {
  children: ReactNode;
}

const AppContent: React.FC<AppContentProps> = ({ children }) => {
  const { toggleSidebar, state: sidebarState, isMobile } = useSidebar();
  const currentPathname = usePathname();
  const router = useRouter();
  const { appUser, userAppRole, isLoadingAuth } = useAuth(); // Use context

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login'); // Explicit redirect after signOut
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // This useEffect handles redirection based on auth state
  React.useEffect(() => {
    if (!isLoadingAuth) {
      if (!appUser && currentPathname !== '/login') {
        router.replace('/login');
      } else if (appUser && currentPathname === '/login') {
        router.replace('/');
      }
    }
  }, [isLoadingAuth, appUser, currentPathname, router]);


  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Carregando autenticação...</p>
      </div>
    );
  }
  
  // If not authenticated and not on login page, redirect is handled by useEffect.
  // If on login page and authenticated, redirect to home is handled.
  // This component might still render briefly before redirect, or not at all if redirect happens fast.

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
             <Avatar className="h-10 w-10 bg-primary hover:bg-primary/90">
                <AvatarImage src={appUser?.photoURL || undefined} alt={appUser?.displayName || "Usuário"} data-ai-hint="user avatar small" />
                <AvatarFallback className="text-primary-foreground font-semibold">
                    {appUser?.displayName ? appUser.displayName.charAt(0).toUpperCase() : (appUser?.email ? appUser.email.charAt(0).toUpperCase() : "U")}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
               <h2 className="text-base font-semibold text-sidebar-foreground truncate">{ appUser?.displayName || appUser?.email || "Usuário"}</h2>
               <p className="text-xs text-sidebar-foreground/70 truncate capitalize">{userAppRole || "Não logado"}</p>
            </div>
          </div>
        </SidebarHeader>
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
                              sidebarState === 'expanded' ? "justify-start" : "justify-center",
                              sidebarState === 'collapsed' && !isMobile && "size-8 p-0"
                          )}
                          aria-label="Sair"
                      >
                          <LogOut className="h-5 w-5 flex-shrink-0" />
                          <span className={cn( (sidebarState === 'collapsed' && !isMobile) && "hidden")}>
                              Sair
                          </span>
                      </Button>
                  </TooltipTrigger>
                  {sidebarState === 'collapsed' && !isMobile && (
                      <TooltipContent side="right" align="center">
                          <p>Sair</p>
                      </TooltipContent>
                  )}
              </Tooltip>
          </TooltipProvider>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Image
          src="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/Whisk_7171a56086%20(2).svg"
          alt="Blurred Background"
          fill // Changed from layout="fill"
          sizes="100vw" // Added for fill
          style={{objectFit: "cover", objectPosition: "center"}} // Changed from objectFit, objectPosition
          className="z-[-1] filter blur-lg"
          data-ai-hint="abstract background"
          priority // Consider adding priority if it's LCP
        />
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/70 backdrop-blur-md px-4 sm:px-6 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full text-foreground hover:bg-accent hover:text-accent-foreground md:hidden" // Hide on md and up
            aria-label="Toggle sidebar"
          >
             <Menu className="h-6 w-6" />
          </Button>
           <div className="flex-grow text-center md:text-left">
             <h1 className="text-lg font-semibold text-primary truncate">BrasilVis Energia</h1>
           </div>
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

  // Render only children for login page, AuthProvider handles auth state
  if (pathname === '/login') {
    return (
      <html lang="pt-BR" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
          <title>Login - BrasilVis App</title>
        </head>
        <body className="font-body antialiased">
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </body>
      </html>
    );
  }

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
          <SidebarProvider defaultOpen>
            <AppContent>{children}</AppContent>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
