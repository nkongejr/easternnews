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
  useEffect(() => { adminApi.get('/advertisers/id/${id}')
    .then((r) => setItem(r.data)); }, [id]);
  if (!item) return <p>Loading...</p>;
  return (<div><h1 className="text-2xl font-bold mb-6">Edit Advertiser</h1><AdvertiserForm initial={item} /></div>);
}