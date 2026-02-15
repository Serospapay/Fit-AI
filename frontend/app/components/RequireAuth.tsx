'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PUBLIC_PATHS = ['/', '/login', '/register', '/about', '/calculators'];

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const isPublic = PUBLIC_PATHS.some((p) => p === pathname || pathname?.startsWith(p + '/'));
    if (!token && !isPublic) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
