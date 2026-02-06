'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { logActivity } from '@/lib/logger';
import type { User as AppUser } from '@/types';

interface AuthContextType {
    user: User | null;
    appUser: AppUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isCollaborator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    // Initialize loading to true only if auth exists, otherwise false to render content immediately
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safe check for auth initialization
        if (!auth) {
            console.warn('Auth not initialized');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser && db) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as AppUser;
                        // Force superadmin role if email matches
                        if (firebaseUser.email === 'wegvivas@gmail.com' && userData.role !== 'superadmin') {
                            const updatedUser = { ...userData, role: 'superadmin' as const };
                            await setDoc(doc(db, 'users', firebaseUser.uid), updatedUser);
                            setAppUser(updatedUser);
                        } else if (!userData.tenantId) {
                            // Assign tenantId to existing users if missing
                            const updatedUser = { ...userData, tenantId: firebaseUser.uid.substring(0, 8) };
                            await setDoc(doc(db, 'users', firebaseUser.uid), updatedUser);
                            setAppUser(updatedUser);
                        } else {
                            setAppUser(userData);
                            await logActivity({ level: 'info', service: 'AUTH', message: `Sesión iniciada: ${firebaseUser.email}`, userId: firebaseUser.uid });
                        }
                    } else {
                        const isSuperAdminEmail = firebaseUser.email === 'wegvivas@gmail.com';
                        const newUser: AppUser = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName,
                            role: isSuperAdminEmail ? 'superadmin' : 'user',
                            purchases: [],
                            createdAt: new Date(),
                            tenantId: firebaseUser.uid.substring(0, 8)
                        };
                        // Attempt to save, but catch if db permissions fail
                        try {
                            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                        } catch (e) {
                            console.error('Error saving new user:', e);
                        }
                        setAppUser(newUser);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setAppUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error('Auth not initialized');
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, name: string) => {
        if (!auth) throw new Error('Firebase Auth not initialized');
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

        if (db) {
            const isSuperAdminEmail = newUser.email === 'wegvivas@gmail.com';
            const userData: AppUser = {
                uid: newUser.uid,
                email: newUser.email || email,
                displayName: name,
                role: isSuperAdminEmail ? 'superadmin' : 'user',
                purchases: [],
                createdAt: new Date(),
                tenantId: newUser.uid.substring(0, 8)
            };
            await setDoc(doc(db, 'users', newUser.uid), userData);
            setAppUser(userData);
        }
    };

    const signInWithGoogle = async () => {
        if (!auth) throw new Error('Auth not initialized');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logOut = async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
        setAppUser(null);
    };

    const isAdmin = appUser?.role === 'admin' || appUser?.role === 'superadmin' || user?.email === 'wegvivas@gmail.com';
    const isSuperAdmin = appUser?.role === 'superadmin' || user?.email === 'wegvivas@gmail.com';
    const isCollaborator = ['collaborator', 'author', 'editor', 'admin', 'superadmin'].includes(appUser?.role || '') || user?.email === 'wegvivas@gmail.com';

    // Prevent white screen: always render children if not loading, OR if auth is missing (dev mode)
    return (
        <AuthContext.Provider value={{
            user,
            appUser,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signOut: logOut,
            isAdmin,
            isSuperAdmin,
            isCollaborator
        }}>
            {children}
            {loading && (
                <div className="fixed inset-0 bg-background flex items-center justify-center text-textPrimary z-[9999]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 italic">Cargando...</span>
                    </div>
                </div>
            )}
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
