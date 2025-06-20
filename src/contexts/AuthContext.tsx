
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import type { AppUser, FirestoreUser } from '@/types/user';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null; // Nosso tipo combinado com dados do Firestore
  isLoadingAuth: boolean;
  userAppRole: 'admin' | 'vendedor' | 'user' | 'prospector' | 'pending_setup' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userAppRole, setUserAppRole] = useState<AuthContextType['userAppRole']>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoadingAuth(true);
      setFirebaseUser(user);

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreUserData = userDocSnap.data() as FirestoreUser;
            const combinedUser: AppUser = {
              uid: user.uid,
              email: user.email,
              displayName: firestoreUserData.displayName || user.displayName,
              photoURL: firestoreUserData.photoURL || user.photoURL,
              type: firestoreUserData.type,
              cpf: firestoreUserData.cpf,
              personalBalance: firestoreUserData.personalBalance || 0,
              mlmBalance: firestoreUserData.mlmBalance || 0,
              // Adicione outros campos conforme necessário
            };
            setAppUser(combinedUser);
            setUserAppRole(firestoreUserData.type);
          } else {
            // Documento do usuário não encontrado no Firestore.
            // Pode ser um novo usuário Auth que ainda não tem registro no Firestore,
            // ou um usuário admin hardcoded por email.
            console.warn(`Firestore document for user ${user.uid} not found.`);
            if (user.email === 'lucasmoura@sentenergia.com') {
                // Fallback para admin hardcoded se o doc não existir (idealmente deveria existir)
                const adminFallback: AppUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || "Admin Lucas",
                    type: 'admin',
                    personalBalance: 0,
                    mlmBalance: 0,
                };
                setAppUser(adminFallback);
                setUserAppRole('admin');
            } else {
                 // Para outros usuários, se o doc não existir, tratar como 'pending_setup' ou erro
                setAppUser(null); // Ou um AppUser básico com type 'pending_setup'
                setUserAppRole('pending_setup');
            }
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setAppUser(null);
          setUserAppRole(null);
        }
      } else {
        setAppUser(null);
        setUserAppRole(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, isLoadingAuth, userAppRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
