"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, User } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "advariant_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function validateToken(storedToken: string) {
    try {
      const { user } = await authApi.me(storedToken);
      setUser(user);
      setToken(storedToken);
    } catch {
      // Token invalid, clear it
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const { token, user } = await authApi.login(email, password);
      localStorage.setItem(STORAGE_KEY, token);
      setToken(token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email: string, password: string, firstName?: string, lastName?: string) {
    setIsLoading(true);
    try {
      const { token, user } = await authApi.register(email, password, firstName, lastName);
      localStorage.setItem(STORAGE_KEY, token);
      setToken(token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Ignore errors
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);
  
  return { user, isLoading };
}
