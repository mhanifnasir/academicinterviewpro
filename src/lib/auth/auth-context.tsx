"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  domicileProvince?: string;
  highestDegree?: string;
  university?: string;
  cgpa?: number;
  graduationYear?: number;
  thesisTopic?: string;
  targetCommission?: string;
  experienceYears?: string;
  bio?: string;
  readinessScore?: number;
  streakDays?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: "candidate" | "admin" | "reviewer";
  isLoading: boolean;
  login: (email: string, password: string, role?: "candidate" | "admin") => Promise<{ success: boolean; error?: string }>;
  register: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<"candidate" | "admin" | "reviewer">("candidate");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            if (data.roles && data.roles.includes("admin")) {
              setRole("admin");
            } else {
              setRole("candidate");
            }
          }
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    try {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          loadUser();
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch {
      // ignore
    }
  }, []);

  const login = async (email: string, password: string, selectedRole: "candidate" | "admin" = "candidate") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setRole(data.role);
      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData.profile);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  const register = async (formData: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    setRole("candidate");
    window.location.href = "/auth/login";
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || "Update failed" };
      }

      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
