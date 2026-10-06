'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import { Author } from '@/types';

export default function AuthorForm({ initial }: { initial?: Author }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: initial?.name || '', title: initial?.title || 'Staff Writer', bio: initial?.bio || '', photo: initial?.photo || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (initial) await adminApi.put(`/authors/${initial._id}`, form);
      else await adminApi.post('/authors', form);
      router.push('/admin/authors');
    } catch {
      setError('The author could not be saved. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid gap-5">
        <div><label htmlFor="author-name" className="mb-1.5 block text-sm font-semibold">Full name <span className="text-red-600">*</span></label><input id="author-name" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Grace Karimi" className="w-full rounded border px-3 py-2.5" /></div>
        <div><label htmlFor="author-title" className="mb-1.5 block text-sm font-semibold">Title or role</label><input id="author-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Reporter" className="w-full rounded border px-3 py-2.5" /><p className="mt-1 text-xs text-gray-500">This appears below the author’s name on their profile.</p></div>
        <div><label htmlFor="author-bio" className="mb-1.5 block text-sm font-semibold">Short biography</label><textarea id="author-bio" value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={5} maxLength={500} placeholder="Tell readers what this author covers..." className="w-full resize-y rounded border px-3 py-2.5" /><p className="mt-1 text-right text-xs text-gray-500">{form.bio.length}/500</p></div>
        <div><label className="mb-1.5 block text-sm font-semibold">Profile photo</label><ImageUploader value={form.photo} onChange={(url) => update('photo', url)} /><p className="mt-1 text-xs text-gray-500">Use a clear headshot. JPG or PNG recommended.</p></div>
      </div>
      {error && <p role="alert" className="mt-5 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="mt-7 flex items-center gap-3 border-t pt-5"><button type="submit" disabled={saving} className="rounded bg-brand-blue px-5 py-2.5 font-semibold text-white hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : initial ? 'Save changes' : 'Create author'}</button><button type="button" onClick={() => router.push('/admin/authors')} className="rounded border px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button></div>
    </form>
  );
}
