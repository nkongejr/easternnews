'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, advertisers: 0, publications: 0 });

  useEffect(() => {
    const load = async () => {
      const [articlesRes, advertisersRes, issuesRes] = await Promise.all([
        adminApi.get('/articles?status=all&limit=1'),
        adminApi.get('/advertisers'),
        adminApi.get('/issues'),
      ]);
      setStats({
        articles: articlesRes.data.totalResults,
        advertisers: advertisersRes.data.length,
        publications: issuesRes.data.length,
      });
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        <Link href="/admin/articles" className="bg-white p-6 rounded shadow text-center hover:shadow-md">
          <p className="text-3xl font-bold text-brand-blue">{stats.articles}</p>
          <p className="text-sm text-gray-500">Total Articles</p>
        </Link>
        <Link href="/admin/advertisers" className="bg-white p-6 rounded shadow text-center hover:shadow-md">
          <p className="text-3xl font-bold text-brand-blue">{stats.advertisers}</p>
          <p className="text-sm text-gray-500">Advertisers</p>
        </Link>
        <Link href="/admin/publications" className="bg-white p-6 rounded shadow text-center hover:shadow-md">
          <p className="text-3xl font-bold text-brand-blue">{stats.publications}</p>
          <p className="text-sm text-gray-500">Publications</p>
        </Link>
      </div>
    </div>
  );
}
