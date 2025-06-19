
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
  SidebarTrigger,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, UserCog, CircleUserRound, LogOut, PanelLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components
import { cn } from "@/lib/utils";

// Metadata can still be defined but might not be used if the whole component is client-side
// export const metadata: Metadata = {
//   title: 'Energisa Invoice Editor',
//   description: 'Editable Energisa Invoice',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('isLoggedIn');
    }
    router.push('/login');
  };

  // Hide sidebar on login page
  if (pathname === '/login') {
    return (
      <html lang="pt-BR" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
          <title>Login - Energisa App</title>
        </head>
        <body className="font-body antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  // Must be called within SidebarProvider, so we wrap the content
  const AppContent = () => {
    const { toggleSidebar, state: sidebarState, isMobile } = useSidebar();
    const currentPathname = usePathname(); // usePathname inside AppContent

    return (
      <>
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
              </Button>
              <div className="flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden">BrasilVis</h2>
                <p className="text-xs text-sidebar-foreground/70 truncate group-data-[collapsible=icon]:hidden">Menu Principal</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Ranking de Performance">
                    <BarChart3 />
                    Ranking
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/" passHref legacyBehavior>
                  <SidebarMenuButton isActive={currentPathname === '/'} tooltip="Calculadora de Economia">
                    <Calculator />
                    Calculadora
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Gestão de Clientes">
                    <UsersRound />
                    CRM
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Minha Carteira">
                    <Wallet />
                    Carteira
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Planejamento de Carreira">
                    <Rocket />
                    Plano de Carreira
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Configurações de Usuários">
                    <UserCog />
                    Gerenciar Usuários
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Meu Perfil">
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
                                sidebarState === 'collapsed' && !isMobile && "size-8 p-0" // Icon only when collapsed on desktop
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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:hidden">
            <SidebarTrigger className="md:hidden">
               <PanelLeft className="h-5 w-5" />
               <span className="sr-only">Toggle Menu</span>
            </SidebarTrigger>
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </>
    );
  };

  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>Energisa App</title>
      </head>
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen> {/* Ensure defaultOpen is suitable, or manage via cookie/state */}
          <AppContent />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
