'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

type Role = 'admin' | 'super_admin' | 'customer';

/**
 * Hook that waits for Zustand hydration before checking auth.
 * Returns { ready: boolean } — render nothing until ready is true.
 */
export function useAuthGuard(requiredRoles?: Role[]) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait until Zustand has rehydrated from localStorage
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      router.push('/admin');
    }
  }, [_hasHydrated, isAuthenticated, user?.role]);

  const ready = _hasHydrated && isAuthenticated;
  const authorized = ready && (!requiredRoles || (user ? requiredRoles.includes(user.role) : false));

  return { ready, authorized, user };
}
