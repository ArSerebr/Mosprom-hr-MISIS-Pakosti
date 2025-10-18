'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Center } from '@mantine/core';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'hr' | 'university';
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Проверяем права доступа
        if (requiredRole === 'admin' && user?.role !== 'admin') {
          router.push('/unauthorized');
          return;
        }
        
        if (requiredRole === 'hr' && !['admin', 'hr'].includes(user?.role || '')) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackPath]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Проверяем права доступа
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      return null;
    }
    
    if (requiredRole === 'hr' && !['admin', 'hr'].includes(user?.role || '')) {
      return null;
    }
  }

  return <>{children}</>;
}
