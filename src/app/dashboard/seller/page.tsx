
// src/app/dashboard/seller/page.tsx
"use client";

import { Suspense, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import SellerCommissionDashboard from '@/components/seller/SellerCommissionDashboard';
import type { AppUser } from '@/types/user'; 
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Loader2 } from 'lucide-react';

export default function SellerDashboardPage() {
  const { appUser, isLoadingAuth, userAppRole } = useAuth(); // Use context
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && (!appUser || userAppRole !== 'vendedor')) {
      // Redirect if not loading, and not a seller, or no appUser (not logged in)
      router.replace('/login'); 
    }
  }, [isLoadingAuth, appUser, userAppRole, router]);

  if (isLoadingAuth || !appUser || userAppRole !== 'vendedor') {
    // Show loader while checking auth or if user is not a seller
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Carregando dados do vendedor...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p className="text-lg font-medium">Carregando Painel do Vendedor...</p>
      </div>
    }>
      <SellerCommissionDashboard loggedInUser={appUser as AppUser} />
    </Suspense>
  );
}
