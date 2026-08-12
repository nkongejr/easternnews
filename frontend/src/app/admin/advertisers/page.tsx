// src/app/admin/advertisers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';
import { Advertiser } from '@/types';

export default function AdminAdvertisersList() {
  const [items, setItems] = useState<Advertiser[]>([]);
  const load = () => adminApi.get('/advertisers').then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this advertiser?')) return;
    await adminApi.delete(`/advertisers/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertisers</h1>
        <Link href="/admin/advertisers/new" className="bg-brand-blue text-white px-4 py-2 rounded font-semibold">+ New Advertiser</Link>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-left">
          <tr><th className="p-3">Business</th><th className="p-3">Category</th><th className="p-3">Placement</th><th className="p-3">Actions</th></tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-3">{a.businessName}</td>
              <td className="p-3">{a.category}</td>
              <td className="p-3">{a.adPlacement}</td>
              <td className="p-3 space-x-3">
                <Link href={`/admin/advertisers/${a._id}/edit`} className="text-brand-blue hover:underline">Edit</Link>
                <button onClick={() => remove(a._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}