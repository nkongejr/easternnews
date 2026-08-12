'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import { clearToken } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  const logout = () => {
    clearToken();
    router.push('/admin/login');
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <aside className="w-56 bg-brand-blue-dark text-white p-4 space-y-2">
          <h2 className="font-bold mb-4">Newsroom Admin</h2>
          <Link href="/admin/dashboard" className="block py-1 hover:text-brand-gold">Dashboard</Link>
          <Link href="/admin/articles" className="block py-1 hover:text-brand-gold">Articles</Link>
          <Link href="/admin/advertisers" className="block py-1 hover:text-brand-gold">Advertisers</Link>
          <button onClick={logout} className="block py-1 mt-6 text-red-300 hover:text-red-100">Logout</button>
        </aside>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </AdminGuard>
  );
}