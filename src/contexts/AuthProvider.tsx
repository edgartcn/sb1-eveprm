import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.firstName || session.user.email!.split('@')[0],
          });
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      }
    };
    initializeAuth();
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange", event);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.firstName || session.user.email!.split('@')[0],
        });
      } else {
        console.log('No active session');
        logout();
      }
    });
    return () => subscription.unsubscribe();
  }, [setUser, logout]);

  return <>{children}</>;
}

