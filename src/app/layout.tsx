
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Calculator, UsersRound, Wallet, Rocket, UsersCog, CircleUserRound, LogOut, PanelLeft } from 'lucide-react';

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
        <SidebarProvider defaultOpen>
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                {/* You can add a logo here if you have one */}
                {/* <Image src="/logo.svg" alt="BrasilVis Logo" width={32} height={32} /> */}
                <h2 className="text-xl font-semibold text-sidebar-foreground">BrasilVis</h2>
              </div>
              <p className="text-xs text-sidebar-foreground/70">Menu Principal</p>
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
                    <SidebarMenuButton isActive={pathname === '/'} tooltip="Calculadora de Economia">
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
                      <UsersCog />
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
            <SidebarFooter className="p-4 border-t border-sidebar-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  {/* <span className="text-sm text-sidebar-foreground">Nome Usuário</span> */}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" aria-label="Sair">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:hidden">
              {/* Mobile Sidebar Trigger */}
              <SidebarTrigger className="md:hidden">
                 <PanelLeft className="h-5 w-5" />
                 <span className="sr-only">Toggle Menu</span>
              </SidebarTrigger>
              {/* You can add breadcrumbs or other header content for mobile here */}
            </header>
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

