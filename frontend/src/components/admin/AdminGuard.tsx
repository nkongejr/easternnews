'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import { getToken } from '@/lib/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const token = getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }
      try {
        await adminApi.get('/auth/me');
        setReady(true);
      } catch {
        router.push('/admin/login');
      }
    };
    check();
  }, [router]);

  if (!ready) return <div className="p-10 text-center">Checking authentication...</div>;
  return <>{children}</>;
}