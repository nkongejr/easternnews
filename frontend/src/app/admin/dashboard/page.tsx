'use client';

import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, advertisers: 0 });

  useEffect(() => {
    const load = async () => {
      const [articlesRes, advertisersRes] = await Promise.all([
        adminApi.get('/articles?status=all&limit=1'),
        adminApi.get('/advertisers'),
      ]);
      setStats({
        articles: articlesRes.data.totalResults,
        advertisers: advertisersRes.data.length,
      });
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-3xl font-bold text-brand-blue">{stats.articles}</p>
          <p className="text-sm text-gray-500">Total Articles</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-3xl font-bold text-brand-blue">{stats.advertisers}</p>
          <p className="text-sm text-gray-500">Advertisers</p>
        </div>
      </div>
    </div>
  );
}