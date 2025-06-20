
"use client";

import { Suspense } from 'react';
import AdminCommissionDashboard from '@/components/admin/AdminCommissionDashboard';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Loader2, ShieldCheck } from 'lucide-react'; // For admin icon and loader
import type { AppUser } from '@/types/user';

export default function AdminDashboardPage() {
  const { appUser, isLoadingAuth, userAppRole } = useAuth(); // Use context

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Verificando acesso...</p>
      </div>
    );
  }

  if (userAppRole !== 'admin' || !appUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-destructive">
        <ShieldCheck size={64} className="mb-4" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p className="text-lg font-medium">Carregando Painel do Administrador...</p>
      </div>
    }>
      {/* Pass the real appUser from context to the dashboard component */}
      <AdminCommissionDashboard loggedInUser={appUser as AppUser} />
    </Suspense>
  );
}
