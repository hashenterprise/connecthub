'use client'
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { api } from '@/lib/api';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  name: string;
}

export function useAuth() {
  const router = useRouter();
  const { user, setUser, logout: clearUser } = useUserStore();

  const signIn = useCallback(async (data: SignInData) => {
    try {
      const response = await api.auth.signIn(data);
      setUser(response.user);
      router.push('/'); // Redirect to home page after sign in
      return response;
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  }, [router, setUser]);

  const signUp = useCallback(async (data: SignUpData) => {
    try {
      const response = await api.auth.signUp(data);
      setUser(response.user);
      router.push('/home'); // Redirect to home page after sign up
      return response;
    } catch (error) {
      throw new Error('Failed to sign up');
    }
  }, [router, setUser]);

  const logout = useCallback(() => {
    clearUser();
    router.push('/');
  }, [clearUser, router]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
      } else {
        clearUser();
      }
    } catch (error) {
      clearUser();
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    logout,
    checkAuth
  };
}