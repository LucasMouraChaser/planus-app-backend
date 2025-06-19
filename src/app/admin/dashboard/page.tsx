// src/app/admin/dashboard/page.tsx
"use client";

import { Suspense } from 'react';
import AdminCommissionDashboard from '@/components/admin/AdminCommissionDashboard';
import { ShieldCheck } from 'lucide-react'; // For admin icon

// Mock loggedInUser - replace with actual auth context
const MOCK_ADMIN_USER = { 
  uid: 'admin123', 
  email: 'admin@example.com', 
  displayName: 'Admin User', 
  type: 'admin' 
};

export default function AdminDashboardPage() {
  // In a real app, you'd get the loggedInUser from your auth context
  // and potentially protect this route.
  const loggedInUser = MOCK_ADMIN_USER;

  if (loggedInUser?.type !== 'admin') {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando Painel do Administrador...</p>
      </div>
    }>
      <AdminCommissionDashboard loggedInUser={loggedInUser as any} />
    </Suspense>
  );
}
