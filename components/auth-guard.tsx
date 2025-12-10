'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoadingPage } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'Teacher' | 'Student';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        switch (user.role) {
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
            router.push('/unauthorized');
        }
        return;
      }
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
