/**
 * Custom hook for authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import type { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        // Save user data from response (could be in response.user or response.data)
        const userData = response.user || response.data;
        if (userData) {
          authService.saveUser(userData);
          setUser(userData);
          
          // Redirect based on role
          switch (userData.role) {
            case 'Admin':
              router.push('/admin');
              break;
            case 'Teacher':
              router.push('/teacher');
              break;
            case 'Student':
              router.push('/student');
              break;
            default:
              router.push('/');
          }
        }
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.removeUser();
      setUser(null);
      router.push('/login');
    }
  };

  const checkAuth = (requiredRole?: string): boolean => {
    if (!user) {
      router.push('/login');
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
      return false;
    }

    return true;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
}
