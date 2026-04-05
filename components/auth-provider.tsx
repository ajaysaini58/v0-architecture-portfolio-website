"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export type UserRole = "admin" | "architect" | "client" | "hr" | null;

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  company?: string;
  userType: string;
}

interface AuthContextType {
  user: any | null;
  role: UserRole;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  const fetchProfile = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setProfile({
        id: data.id,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        avatarUrl: data.avatar_url,
        company: data.company_name,
        userType: data.user_type,
      });
      setRole(data.user_type as UserRole);
    }
    return data;
  };

  useEffect(() => {
    if (!hasSupabase) {
      setIsLoading(false);
      return;
    }

    const supabase = createSupabaseClient();
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          
          if (!profileData) {
            // Fallback role detection
            if (session.user.email?.includes('admin')) {
              setRole('admin');
            } else {
              setRole('client');
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setProfile(null);
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [hasSupabase]);

  const signOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
