'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // Corrected import path
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Added for Firestore interaction
import { firestore } from '../lib/firebaseConfig'; // Added for Firestore interaction

// Keep your existing User interface, we'll map FirebaseUser to it
interface User {
  id: string; // Firebase UID
  email: string | null;
  name: string | null;
  isDeputyMember: boolean; // This will be custom logic, perhaps stored in Firestore
  loyaltyPoints: number;   // This will be custom logic, perhaps stored in Firestore
  avatar?: string | null;   // Firebase photoURL
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>; // Changed to Promise<void> for async signOut
  updateUserProfile: (updates: { name?: string; avatar?: string }) => Promise<void>; // Renamed and specified for profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        
        // Fetch additional user data from Firestore
        const userDocRef = doc(firestore, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const customData = userDocSnap.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || customData.name, // Prioritize Firebase profile, fallback to Firestore
            avatar: firebaseUser.photoURL || customData.avatar, // Prioritize Firebase profile, fallback to Firestore
            isDeputyMember: customData.isDeputyMember || false,
            loyaltyPoints: customData.loyaltyPoints || 0,
          });
        } else {
          // If no custom data, create a basic profile (e.g., for users created directly via Firebase console)
           // Or, if this is part of registration, this will be set by the register function
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar: firebaseUser.photoURL,
            isDeputyMember: false, // Default value
            loyaltyPoints: 0,    // Default value
          });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user state
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      // setIsLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, { displayName: name });

      // Create a user document in Firestore
      const userDocRef = doc(firestore, "users", firebaseUser.uid);
      const initialUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name, // Storing name in Firestore as well
        isDeputyMember: false,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(), // Optional: timestamp
      };
      await setDoc(userDocRef, initialUserData);
      
      // onAuthStateChanged will handle setting the user state with the new profile and Firestore data
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      // setIsLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUserProfile = async (updates: { name?: string; avatar?: string }) => {
    if (auth.currentUser) {
      try {
        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
          photoURL: updates.avatar,
        });

        // Update Firestore document
        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const firestoreUpdates: any = {};
        if (updates.name) firestoreUpdates.name = updates.name;
        if (updates.avatar) firestoreUpdates.avatar = updates.avatar;
        
        if (Object.keys(firestoreUpdates).length > 0) {
            await setDoc(userDocRef, firestoreUpdates, { merge: true });
        }

        // Optimistically update local state or let onAuthStateChanged handle it if preferred
        setUser(prevUser => prevUser ? {
          ...prevUser,
          name: updates.name ?? prevUser.name,
          avatar: updates.avatar ?? prevUser.avatar,
        } : null);

      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error; // Re-throw to be handled by the caller
      }
    } else {
      console.error("No user logged in to update profile.");
      throw new Error("No user logged in.");
    }
  };
  
  // The updateUser function from the original context might be for different kinds of updates
  // For now, we've focused on profile (name, avatar). Other fields like loyaltyPoints
  // or isDeputyMember would be updated via specific backend functions (Cloud Functions) later.

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoading, // Ensure loading is complete
    login,
    register,
    logout,
    updateUserProfile // Use the new specific updater
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
