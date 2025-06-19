
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
import Image from 'next/image'; // Importar Image
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, UserCog, CircleUserRound, LogOut, FileText, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
          <title>Login - BrasilVis App</title>
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
            <div className="flex items-center gap-2">
              {/* Avatar button removed from here */}
              <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
                 <h2 className="text-lg font-semibold text-sidebar-foreground truncate">BrasilVis</h2>
                 <p className="text-xs text-sidebar-foreground/70 truncate">Menu Principal</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Ranking de Performance" isActive={currentPathname === '/ranking'}>
                    <BarChart3 />
                    Ranking
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
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
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Planejamento de Carreira" isActive={currentPathname === '/plano-carreira'}>
                    <Rocket />
                    Plano de Carreira
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Configurações de Usuários" isActive={currentPathname === '/gerenciar-usuarios'}>
                    <UserCog />
                    Gerenciar Usuários
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Meu Perfil" isActive={currentPathname === '/perfil'}>
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
            {/* You can add more header content here, like a title or search bar */}
          </header>
          <main className="flex-1 overflow-auto"> {/* Added overflow-auto here */}
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
        <title>BrasilVis App</title>
      </head>
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen>
          <AppContent />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
