'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import { Article } from '@/types';

const CATEGORIES = [
  'Meru', 'Tharaka Nithi', 'Isiolo', 'Embu', 'Samburu', 'Kirinyaga',
  'Laikipia', 'Kitui', 'Machakos', 'Makueni', 'Marsabit',
  'Business', 'Sports', 'Opinion', 'Editorial', 'National',
];

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [authors, setAuthors] = useState<{ _id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    deck: initial?.deck || '',
    body: initial?.body || '',
    category: initial?.category || 'Meru',
    author: initial?.author?._id || '',
    bylineCredit: initial?.bylineCredit || 'Eastern Correspondent',
    featuredImageUrl: initial?.featuredImage?.url || '',
    featuredImageCaption: initial?.featuredImage?.caption || '',
    featuredImageCredit: initial?.featuredImage?.credit || 'Photo KNA',
    tags: initial?.tags?.join(', ') || '',
    isFeatured: initial?.isFeatured || false,
    isHero: initial?.isHero || false,
    status: initial?.status || 'draft',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get('/authors').then((res) => setAuthors(res.data));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      deck: form.deck,
      body: form.body,
      category: form.category,
      author: form.author || undefined,
      bylineCredit: form.bylineCredit,
      featuredImage: {
        url: form.featuredImageUrl,
        caption: form.featuredImageCaption,
        credit: form.featuredImageCredit,
      },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isHero: form.isHero,
      status: form.status,
    };

    try {
      if (initial) {
        await adminApi.put(`/articles/${initial._id}`, payload);
      } else {
        await adminApi.post('/articles', payload);
      }
      router.push('/admin/articles');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded shadow">
      <input required placeholder="Headline" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-3 py-2" />
      <input placeholder="Deck / subheadline" value={form.deck} onChange={(e) => setForm({ ...form, deck: e.target.value })} className="w-full border rounded px-3 py-2" />

      <div className="grid grid-cols-2 gap-4">
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded px-3 py-2">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="border rounded px-3 py-2">
          <option value="">-- Select Author --</option>
          {authors.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      </div>

      <input placeholder="Byline credit (e.g. KNA)" value={form.bylineCredit} onChange={(e) => setForm({ ...form, bylineCredit: e.target.value })} className="w-full border rounded px-3 py-2" />

      <textarea required rows={10} placeholder="Full article body (separate paragraphs with blank lines; start a line with > for pull-quotes)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full border rounded px-3 py-2" />

      <div>
        <label className="text-sm font-semibold block mb-1">Featured Image</label>
        <ImageUploader value={form.featuredImageUrl} onChange={(url) => setForm({ ...form, featuredImageUrl: url })} />
        <input placeholder="Image caption" value={form.featuredImageCaption} onChange={(e) => setForm({ ...form, featuredImageCaption: e.target.value })} className="w-full border rounded px-3 py-2 mt-2" />
        <input placeholder="Photo credit (e.g. Photo KNA)" value={form.featuredImageCredit} onChange={(e) => setForm({ ...form, featuredImageCredit: e.target.value })} className="w-full border rounded px-3 py-2 mt-2" />
      </div>

      <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full border rounded px-3 py-2" />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isHero} onChange={(e) => setForm({ ...form, isHero: e.target.checked })} /> Hero (cover story)
        </label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} className="border rounded px-2 py-1 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button disabled={saving} className="bg-brand-blue text-white px-6 py-2 rounded font-semibold">
        {saving ? 'Saving...' : initial ? 'Update Article' : 'Publish Article'}
      </button>
    </form>
  );
}