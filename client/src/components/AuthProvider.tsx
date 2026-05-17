'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/login', '/unauthorized'];
    if (!isAuthenticated() && !publicPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
