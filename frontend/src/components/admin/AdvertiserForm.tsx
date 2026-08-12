// src/components/admin/AdvertiserForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import { Advertiser } from '@/types';

export default function AdvertiserForm({ initial }: { initial?: Advertiser }) {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: initial?.businessName || '',
    category: initial?.category || 'Other',
    description: initial?.description || '',
    phone: initial?.contact?.phone || '',
    email: initial?.contact?.email || '',
    address: initial?.contact?.address || '',
    adPlacement: initial?.adPlacement || 'sidebar',
    linkURL: initial?.linkURL || '',
    logo: initial?.logo || '',
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      businessName: form.businessName,
      category: form.category,
      description: form.description,
      contact: { phone: form.phone, email: form.email, address: form.address },
      adPlacement: form.adPlacement,
      linkURL: form.linkURL,
      logo: form.logo,
      isActive: form.isActive,
    };
    try {
      if (initial) await adminApi.put(`/advertisers/${initial._id}`, payload);
      else await adminApi.post('/advertisers', payload);
      router.push('/admin/advertisers');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded shadow">
      <input required placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full border rounded px-3 py-2" />
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="w-full border rounded px-3 py-2">
        {['Hotel', 'TVET/College', 'University', 'Security Services', 'Other'].map((c) => <option key={c}>{c}</option>)}
      </select>
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
      <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded px-3 py-2" />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded px-3 py-2" />
      <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded px-3 py-2" />
      <select value={form.adPlacement} onChange={(e) => setForm({ ...form, adPlacement: e.target.value as any })} className="w-full border rounded px-3 py-2">
        {['sidebar', 'banner', 'sponsored-post'].map((p) => <option key={p}>{p}</option>)}
      </select>
      <input placeholder="Website URL" value={form.linkURL} onChange={(e) => setForm({ ...form, linkURL: e.target.value })} className="w-full border rounded px-3 py-2" />
      <div>
        <label className="text-sm font-semibold block mb-1">Logo</label>
        <ImageUploader value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
      </label>
      <button disabled={saving} className="bg-brand-blue text-white px-6 py-2 rounded font-semibold">
        {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
      </button>
    </form>
  );
}