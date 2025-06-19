// src/app/dashboard/seller/page.tsx
"use client";

import { Suspense } from 'react';
import SellerCommissionDashboard from '@/components/seller/SellerCommissionDashboard';
import type { AppUser } from '@/types/user'; // Placeholder for AppUser

// Mock loggedInUser - replace with actual auth context
const MOCK_SELLER_USER: AppUser = { 
  uid: 'user1', 
  email: 'vendedor1@example.com', 
  displayName: 'Vendedor Um', 
  type: 'vendedor',
  personalBalance: 1250.75,
  mlmBalance: 350.50,
  photoURL: 'https://placehold.co/100x100.png',
};

export default function SellerDashboardPage() {
  // In a real app, you'd get the loggedInUser from your auth context
  const loggedInUser = MOCK_SELLER_USER;

  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando Painel do Vendedor...</p>
      </div>
    }>
      <SellerCommissionDashboard loggedInUser={loggedInUser} />
    </Suspense>
  );
}
