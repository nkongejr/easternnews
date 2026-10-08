// src/app/admin/advertisers/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import AdvertiserForm from '@/components/admin/AdvertiserForm';
import { Advertiser } from '@/types';

export default function EditAdvertiserPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Advertiser | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    // Backticks, not quotes: this has to interpolate or the admin silently
    // asks the API for a literal "/advertisers/id/${id}" and never loads.
    adminApi
      .get(`/advertisers/id/${id}`)
      .then((response) => setItem(response.data))
      .catch(() => setError('This advertiser could not be found.'));
  }, [id]);

  if (error)
    return (
      <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );

  if (!item) return <p className="text-gray-500">Loading advertiser...</p>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Advertisers</p>
        <h1 className="mt-1 text-3xl font-bold">Edit advertiser</h1>
        <p className="mt-1 text-gray-600">
          Update {item.businessName}&rsquo;s details and where the advert runs.
        </p>
      </div>
      <AdvertiserForm initial={item} />
    </div>
  );
}
