'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import { Article, Author } from '@/types';

const CATEGORIES = [
  'Meru', 'Tharaka Nithi', 'Isiolo', 'Embu', 'Samburu', 'Kirinyaga',
  'Laikipia', 'Kitui', 'Machakos', 'Makueni', 'Marsabit',
  'Business', 'Sports', 'Opinion', 'Editorial', 'National',
];

const initialAuthorIds = (article?: Article) => {
  const authors = article?.authors?.map((author) => author._id).filter(Boolean) || [];
  if (authors.length > 0) return authors;
  return article?.author?._id ? [article.author._id] : [];
};

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    deck: initial?.deck || '',
    body: initial?.body || '',
    category: initial?.category || 'Meru',
    authors: initialAuthorIds(initial),
    bylineCredit: initial?.bylineCredit || 'Eastern Correspondent',
    featuredImageUrl: initial?.featuredImage?.url || '',
    featuredImageCaption: initial?.featuredImage?.caption || '',
    featuredImageCredit: initial?.featuredImage?.credit || 'Photo KNA',
    tags: initial?.tags?.join(', ') || '',
    isFeatured: initial?.isFeatured || false,
    isHero: initial?.isHero || false,
    isBreaking: initial?.isBreaking || false,
    seoTitle: initial?.seoTitle || '',
    seoDescription: initial?.seoDescription || '',
    seoKeywords: initial?.seoKeywords || '',
    status: initial?.status || 'draft',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get('/authors').then((res) => setAuthors(res.data));
  }, []);

  const addAuthor = (authorId: string) => {
    if (!authorId) return;
    setForm((current) => ({
      ...current,
      authors: current.authors.includes(authorId) ? current.authors : [...current.authors, authorId],
    }));
  };

  const removeAuthor = (authorId: string) => {
    setForm((current) => ({
      ...current,
      authors: current.authors.filter((id) => id !== authorId),
    }));
  };

  const moveAuthor = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.authors.length) return current;
      const ordered = [...current.authors];
      [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
      return { ...current, authors: ordered };
    });
  };

  const selectedAuthors = form.authors.map((id) => ({
    id,
    name: authors.find((author) => author._id === id)?.name || 'Selected author',
  }));
  const availableAuthors = authors.filter((author) => !form.authors.includes(author._id));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const selectedAuthorIds = form.authors.filter(Boolean);
    const payload = {
      title: form.title,
      deck: form.deck,
      body: form.body,
      category: form.category,
      author: selectedAuthorIds[0] || null,
      authors: selectedAuthorIds,
      bylineCredit: form.bylineCredit,
      featuredImage: {
        url: form.featuredImageUrl,
        caption: form.featuredImageCaption,
        credit: form.featuredImageCredit,
      },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isHero: form.isHero,
      isBreaking: form.isBreaking,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords,
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
        <select value="" onChange={(e) => { addAuthor(e.target.value); e.target.value = ''; }} className="border rounded px-3 py-2">
          <option value="">-- Add Author --</option>
          {availableAuthors.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      </div>

      <div className="rounded border border-dashed border-gray-300 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Authors in byline order</p>
        {selectedAuthors.length > 0 ? (
          <ol className="space-y-2">
            {selectedAuthors.map((author, index) => (
              <li key={author.id} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium">{index + 1}. {author.name}</span>
                <span className="flex items-center gap-2">
                  <button type="button" onClick={() => moveAuthor(index, -1)} disabled={index === 0} className="text-xs font-semibold text-brand-blue disabled:text-gray-300">Up</button>
                  <button type="button" onClick={() => moveAuthor(index, 1)} disabled={index === selectedAuthors.length - 1} className="text-xs font-semibold text-brand-blue disabled:text-gray-300">Down</button>
                  <button type="button" onClick={() => removeAuthor(author.id)} className="text-xs font-semibold text-red-600">Remove</button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-gray-500">No author selected. The byline credit below will be used as the fallback.</p>
        )}
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
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isBreaking} onChange={(e) => setForm({ ...form, isBreaking: e.target.checked })} /> Breaking news
        </label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} className="border rounded px-2 py-1 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="border-t pt-4 space-y-2">
        <p className="text-sm font-semibold">SEO (optional)</p>
        <input placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input placeholder="SEO description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input placeholder="SEO keywords (comma separated)" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>

      <button disabled={saving} className="bg-brand-blue text-white px-6 py-2 rounded font-semibold">
        {saving ? 'Saving...' : initial ? 'Update Article' : 'Publish Article'}
      </button>
    </form>
  );
}
