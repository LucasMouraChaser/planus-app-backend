// src/types/user.ts
import type { Timestamp } from 'firebase/firestore';

// Updated UserType to include all specified roles
export type UserType = 'admin' | 'vendedor' | 'user' | 'prospector' | 'pending_setup';

// Represents the data structure for a user in Firestore
export type FirestoreUser = {
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
  downlineUids?: string[]; // Array de UIDs dos usuários diretamente indicados por este usuário
  mlmLevel?: number; // Nível do usuário na estrutura MLM
};

// Placeholder for the user object available in the auth context
export type AppUser = {
  uid: string;
  email: string | null;
  displayName:
    | (string & {
        // This type is a string that can be extended with additional properties.
        //
        // This allows for other related types to be assignable here if needed.
        //
        // For example:
        //
        // ```
        // type DisplayNameWithTitle = string & { title: string };
        //
        // const user: AppUser = {
        //   displayName: Object.assign("John Doe", { title: "Mr." }),
        // };
        // ```
      })
    | null;
  cpf?: string;
  type: UserType;
  photoURL?: string | null;
  personalBalance: number;
  mlmBalance: number;
  // Add other relevant fields from
};
