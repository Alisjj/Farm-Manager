import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getCurrentUser, logout as apiLogout } from '@/lib/api';
import { authEvents } from '@/lib/authEvents';

type User = {
  id: string;
  username: string;
  role: 'owner' | 'staff';
  email?: string;
};

type ContextValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<boolean>;
  logout: () => void;
};

const UserContext = createContext<ContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchInFlight = useRef(false);
  const hasInitialized = useRef(false);

  const fetchUser = async (): Promise<boolean> => {
    if (fetchInFlight.current) {
      try {
        console.log('[auth] fetchUser skipped because already in-flight');
      } catch {}
      return false;
    }
    fetchInFlight.current = true;
    setLoading(true);
    try {
      try {
        console.log('[auth] fetchUser start');
      } catch {}
      const u = await getCurrentUser();
      try {
        console.log('[auth] fetchUser got', u);
      } catch {}
      if (u) {
        setUser({
          id: String(u.id),
          username: String(u.username),
          role: u.role === 'owner' ? 'owner' : 'staff',
          email: u.email,
        });
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      try {
        console.log('[auth] fetchUser error', error);
      } catch {}
      setUser(null);
      return false;
    } finally {
      fetchInFlight.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchUser();
    // subscribe to auth events so we react centrally
    const onLogin = () => void fetchUser();
    const onRefresh = () => void fetchUser();
    const onLogout = () => {
      try {
        console.log('[authEvents] logout received');
      } catch {}
      setUser(null);
      // Remove the automatic redirect to prevent loops
      // The UI should handle showing login form when user is null
    };
    try {
      console.log('[auth] subscribing to authEvents');
    } catch {}
    authEvents.on('login', onLogin);
    authEvents.on('refresh', onRefresh);
    authEvents.on('logout', onLogout);
    return () => {
      authEvents.off('login', onLogin);
      authEvents.off('refresh', onRefresh);
      authEvents.off('logout', onLogout);
    };
  }, []);

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    // Remove automatic redirect - let the UI handle showing login form
  };

  return (
    <UserContext.Provider value={{ user, loading, refresh: fetchUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
