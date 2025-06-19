// src/types/user.ts
import type { Timestamp } from 'firebase/firestore';

export type UserType = 'admin' | 'vendedor' | 'cliente'; // Add other types as needed

// Represents the data structure for a user in Firestore
export interface FirestoreUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  cpf?: string;
  type: UserType;
  createdAt: Timestamp | string; // Timestamp in Firestore, string on client
  photoURL?: string | null;
  personalBalance?: number; // Saldo de comissões de vendas diretas
  mlmBalance?: number; // Saldo de comissões da rede MLM
  uplineUid?: string; // UID do usuário que indicou este usuário
  downlineUids?: string[]; // Array de UIDs dos usuários diretamente indicados
  mlmLevel?: number; // Nível do usuário na estrutura MLM
}

// Placeholder for the user object available in the auth context
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  cpf?: string;
  type: UserType;
  photoURL?: string | null;
  personalBalance: number;
  mlmBalance: number;
  // Add other relevant fields from your auth context
}
