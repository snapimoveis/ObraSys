import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface SessionData {
  user: User | null;
  userId: string | null;
  companyId: string | null;
  role: string | null;
  userName: string | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionData | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ companyId: string | null; role: string | null; userName: string | null }>({
    companyId: null,
    role: null,
    userName: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setSession({ companyId: null, role: null, userName: null });
        setLoading(false);
        return;
      }

      // 2. If user exists, listen to their Firestore Profile
      const userDocRef = doc(db, 'users', currentUser.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSession({
            companyId: data.companyId || null,
            role: data.role || null,
            userName: data.name || null
          });
          setError(null);
        } else {
          setError("Perfil de utilizador não encontrado no sistema.");
          setSession({ companyId: null, role: null, userName: null });
        }
        setLoading(false);
      }, (err) => {
        console.error("Session profile listener error:", err);
        setError("Erro ao carregar sessão. Verifique a sua ligação.");
        setLoading(false);
      });

      return () => unsubscribeProfile();
    });

    return () => unsubscribeAuth();
  }, []);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    localStorage.removeItem('obrasys_company_id'); // Cleanup legacy just in case
    setLoading(false);
  };

  return (
    <SessionContext.Provider value={{
      user,
      userId: user?.uid || null,
      companyId: session.companyId,
      role: session.role,
      userName: session.userName,
      loading,
      error,
      logout
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};