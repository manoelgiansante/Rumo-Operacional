import { useState, useEffect, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Initializing auth state...');
    
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.log('[Auth] Error getting session:', error.message);
        } else {
          console.log('[Auth] Initial session:', session ? 'exists' : 'null');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.log('[Auth] Exception getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const authListener = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('[Auth] Auth state changed:', _event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });
      subscription = authListener.data.subscription;
    } catch (error) {
      console.log('[Auth] Error setting up auth listener:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Signing up user:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.log('[Auth] Sign up error:', error.message);
      throw error;
    }
    
    console.log('[Auth] Sign up successful');
    return data;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Signing in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('[Auth] Sign in error:', error.message);
      throw error;
    }
    
    console.log('[Auth] Sign in successful');
    return data;
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('[Auth] Sign out error:', error.message);
      throw error;
    }
    
    console.log('[Auth] Sign out successful');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    console.log('[Auth] Sending password reset email to:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.log('[Auth] Reset password error:', error.message);
      throw error;
    }
    
    console.log('[Auth] Password reset email sent');
  }, []);

  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
});
