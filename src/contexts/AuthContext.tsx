
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import type { AppUser, FirestoreUser } from '@/types/user';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore'; // Added collection, getDocs, Timestamp
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoadingAuth: boolean;
  userAppRole: 'admin' | 'vendedor' | 'user' | 'prospector' | 'pending_setup' | null;
  allFirestoreUsers: FirestoreUser[]; // New: For admin to manage users
  isLoadingAllUsers: boolean; // New: Loading state for allFirestoreUsers
  fetchAllAppUsers: () => Promise<void>; // New: Function to refresh allFirestoreUsers
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userAppRole, setUserAppRole] = useState<AuthContextType['userAppRole']>(null);

  const [allFirestoreUsers, setAllFirestoreUsers] = useState<FirestoreUser[]>([]);
  const [isLoadingAllUsers, setIsLoadingAllUsers] = useState<boolean>(true);

  const fetchAllAppUsers = useCallback(async () => {
    // This function will be gated by userAppRole check where it's called from AdminDashboardPage or similar
    setIsLoadingAllUsers(true);
    try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(docSnap => {
            const data = docSnap.data() as Omit<FirestoreUser, 'uid' | 'createdAt'>; // Data from Firestore
            const createdAtTimestamp = docSnap.data().createdAt as Timestamp;
            return {
                ...data,
                uid: docSnap.id,
                createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : new Date().toISOString(),
            } as FirestoreUser;
        });
        setAllFirestoreUsers(usersList);
    } catch (error) {
        console.error("Erro ao buscar todos os usuários do Firestore:", error);
        setAllFirestoreUsers([]);
    } finally {
        setIsLoadingAllUsers(false);
    }
  }, []); // Removed userAppRole from dependencies, gating will be done by caller

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
            const createdAtTimestamp = firestoreUserData.createdAt as Timestamp;
            const combinedUser: AppUser = {
              uid: user.uid,
              email: user.email,
              displayName: firestoreUserData.displayName || user.displayName,
              photoURL: firestoreUserData.photoURL || user.photoURL,
              type: firestoreUserData.type,
              cpf: firestoreUserData.cpf,
              personalBalance: firestoreUserData.personalBalance || 0,
              mlmBalance: firestoreUserData.mlmBalance || 0,
              createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : undefined,
            };
            setAppUser(combinedUser);
            setUserAppRole(firestoreUserData.type);
          } else {
            console.warn(`Firestore document for user ${user.uid} not found.`);
            if (user.email === 'lucasmoura@sentenergia.com') {
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
                setAppUser(null);
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
        setAllFirestoreUsers([]);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all users when admin logs in or appUser role changes to admin
  useEffect(() => {
    if (userAppRole === 'admin' && !isLoadingAuth) { // ensure auth is resolved before fetching
        fetchAllAppUsers();
    } else if (userAppRole !== 'admin') {
        setAllFirestoreUsers([]); // Clear if not admin
        setIsLoadingAllUsers(false); // Ensure loading is false if not admin
    }
  }, [userAppRole, isLoadingAuth, fetchAllAppUsers]);


  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, isLoadingAuth, userAppRole, allFirestoreUsers, isLoadingAllUsers, fetchAllAppUsers }}>
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
