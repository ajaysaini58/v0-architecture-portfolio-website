'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient, getCurrentUser } from '@/lib/supabase';
import type { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  authUser: any | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authUser: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  refreshAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!hasSupabase) return null;

    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        setUser(data as User);
        setRole(data.role as UserRole);
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
    return null;
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!hasSupabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createSupabaseClient();

      const {
        data: { user: authUserData },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUserData) {
        setAuthUser(null);
        setUser(null);
        setRole(null);
        return;
      }

      setAuthUser(authUserData);
      await fetchUserProfile(authUserData.id);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setAuthUser(null);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [hasSupabase, fetchUserProfile]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (!hasSupabase) return;

    const supabase = createSupabaseClient();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setAuthUser(null);
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [hasSupabase, fetchUserProfile]);

  const signOut = async () => {
    if (!hasSupabase) return;

    try {
      const supabase = createSupabaseClient();
      await supabase.auth.signOut();
      setAuthUser(null);
      setUser(null);
      setRole(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    authUser,
    role,
    isLoading,
    isAuthenticated: !!authUser && !!user,
    signOut,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to check if user has specific role
export function useHasRole(requiredRoles: UserRole | UserRole[]) {
  const { role, isLoading } = useAuth();

  if (isLoading) return undefined;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return role ? roles.includes(role) : false;
}

// Hook to require authentication
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

// Hook to require specific role
export function useRequireRole(requiredRoles: UserRole | UserRole[]) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!role || !roles.includes(role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, role, isLoading, requiredRoles, router]);

  return { isAuthenticated, role, isLoading };
}
