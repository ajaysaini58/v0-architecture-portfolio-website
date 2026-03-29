"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export type UserRole = "admin" | "architect" | "client" | null;

interface AuthContextType {
  user: any | null;
  role: UserRole;
  isLoading: boolean;
  setMockRole: (role: UserRole) => void; // For dev purposes
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  setMockRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to mock data if no Supabase URL is present
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!hasSupabase) {
      // Setup mock state for development
      console.warn("No Supabase URL provided. Using mock auth state for development.");
      const savedMockRole = (typeof window !== "undefined" ? localStorage.getItem("mock_role") : null) as UserRole;
      
      setUser(savedMockRole ? { id: "mock-user-123", email: "mock@example.com" } : null);
      setRole(savedMockRole);
      setIsLoading(false);
      return;
    }

    const supabase = createSupabaseClient();
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Fetch role from user_profiles table
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("user_type")
            .eq("user_id", session.user.id)
            .single();
            
          if (profile) {
              setRole(profile.user_type as UserRole);
          } else {
             // Admin check based on email or metadata
             if (session.user.email?.includes('admin')) {
                setRole('admin');
             } else {
                setRole('client');
             }
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // On change, fetch role again if necessary
        const { data: profile } = await supabase
            .from("user_profiles")
            .select("user_type")
            .eq("user_id", session.user.id)
            .single();
        if (profile) setRole(profile.user_type as UserRole);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [hasSupabase]);

  const setMockRole = (newRole: UserRole) => {
    if (!hasSupabase) {
      if (newRole) {
        localStorage.setItem("mock_role", newRole);
        setUser({ id: "mock-" + newRole, email: `mock-${newRole}@example.com` });
      } else {
        localStorage.removeItem("mock_role");
        setUser(null);
      }
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, setMockRole }}>
      {children}
      
      {/* DevTools: Mock Role Switcher when no Supabase connected */}
      {!hasSupabase && (
        <div className="fixed bottom-4 right-4 z-[100] bg-card border border-border rounded-lg shadow-xl p-3 text-xs w-64 opacity-50 hover:opacity-100 transition-opacity">
          <p className="font-semibold mb-2 text-foreground">Dev Env: Mock Auth</p>
          <div className="flex flex-col gap-1">
            <button onClick={() => setMockRole('admin')} className={`px-2 py-1 text-left rounded ${role === 'admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>Admin View</button>
            <button onClick={() => setMockRole('architect')} className={`px-2 py-1 text-left rounded ${role === 'architect' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>Architect View</button>
            <button onClick={() => setMockRole('client')} className={`px-2 py-1 text-left rounded ${role === 'client' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>Client View</button>
            <button onClick={() => setMockRole(null)} className={`px-2 py-1 text-left rounded ${role === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>Logged Out View</button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
