// src/app/admin/advertisers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';
import { adPlacementLabel } from '@/lib/ads';
import { Advertiser } from '@/types';

export default function AdminAdvertisersList() {
  const [items, setItems] = useState<Advertiser[]>([]);
  const load = (): Promise<unknown> =>
    adminApi.get('/advertisers').then((res) => setItems(res.data));
  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this advertiser?')) return;
    await adminApi.delete(`/advertisers/${id}`);
    load();
  };

  // The article-page slots are the ones the newsroom asks about, and an empty
  // slot renders nothing at all — so say plainly when nothing is booked.
  const booked = (placement: Advertiser['adPlacement']) =>
    items.some((a) => a.adPlacement === placement && a.isActive !== false);
  const emptyArticleSlots = [
    !booked('article-overlay') && '“Over the article (floating)”',
    !booked('article-inline') && '“Inside the article”',
  ].filter(Boolean) as string[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertisers</h1>
        <Link href="/admin/advertisers/new" className="bg-brand-blue text-white px-4 py-2 rounded font-semibold">+ New Advertiser</Link>
      </div>

      {items.length > 0 && emptyArticleSlots.length > 0 && (
        <p className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          No advert is booked in {emptyArticleSlots.join(' or ')} yet, so article pages show
          nothing there. Edit an advertiser below and choose that option under{' '}
          <strong>Where this advert runs</strong> to switch it on.
        </p>
      )}
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-left">
          <tr><th className="p-3">Business</th><th className="p-3">Category</th><th className="p-3">Placement</th><th className="p-3">Actions</th></tr>
        </thead>        <tbody>
          {items.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-3">{a.businessName}</td>
              <td className="p-3">{a.category}</td>
              <td className="p-3">{adPlacementLabel(a.adPlacement)}</td>
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