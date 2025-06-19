
"use client";

import type { Metadata } from 'next';
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
import React, { useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, UserCog, CircleUserRound, LogOut, FileText, Menu, LayoutDashboard, ShieldAlert, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userAppRole, setUserAppRole] = useState<string | null>(null); // 'admin', 'vendedor', or null
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        if (user.email === 'lucasmoura@sentenergia.com') {
          setUserAppRole('admin');
        } else {
          setUserAppRole('vendedor'); // Default role for other authenticated users
        }
        if (currentPathname === '/login') {
          router.replace('/'); // Redirect from login if already authenticated
        }
      } else {
        setUserAppRole(null);
        if (currentPathname !== '/login') {
          router.replace('/login');
        }
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [router, currentPathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle redirect to /login
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error if needed
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Carregando autenticação...</p>
      </div>
    );
  }
  
  // If not authenticated and not on login page, this content won't render due to redirect in useEffect.
  // If on login page, RootLayout handles rendering only children (login page itself).

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
               <h2 className="text-lg font-semibold text-sidebar-foreground truncate">BrasilVis</h2>
               <p className="text-xs text-sidebar-foreground/70 truncate">Menu Principal</p>
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
            <SidebarMenuItem>
              <Link href="/dashboard/seller">
                <SidebarMenuButton isActive={currentPathname === '/dashboard/seller'} tooltip="Meu Painel">
                  <LayoutDashboard />
                  Meu Painel
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
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
              <>
                <SidebarMenuItem>
                  <Link href="/admin/dashboard">
                    <SidebarMenuButton isActive={currentPathname === '/admin/dashboard'} tooltip="Painel Admin">
                      <ShieldAlert />
                      Painel Admin
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="#"> {/* TODO: Update to actual admin users page if/when created */}
                    <SidebarMenuButton tooltip="Gerenciar Usuários (Admin)" isActive={currentPathname === '/admin/users'}>
                      <UserCog />
                      Gerenciar Usuários
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
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
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="z-[-1] filter blur-lg"
          data-ai-hint="abstract background"
        />
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle sidebar"
          >
            <Avatar className="h-8 w-8 bg-primary hover:bg-primary/90">
              <AvatarFallback className="text-primary-foreground font-semibold">BV</AvatarFallback>
            </Avatar>
          </Button>
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

  // Hide sidebar and full app structure on login page
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
          {children}
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
        <SidebarProvider defaultOpen>
          <AppContent>{children}</AppContent>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
