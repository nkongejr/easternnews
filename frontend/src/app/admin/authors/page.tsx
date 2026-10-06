'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';
import { Author } from '@/types';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    adminApi.get('/authors').then(({ data }) => {
      if (active) setAuthors(data);
    }).catch(() => {
      if (active) setError('We could not load the authors. Please try again.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredAuthors = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return authors;
    return authors.filter((author) =>
      [author.name, author.title, author.slug].some((value) => value?.toLowerCase().includes(term))
    );
  }, [authors, query]);

  const remove = async (author: Author) => {
    if (!confirm(`Delete ${author.name}? Articles by this author will no longer have an author assigned.`)) return;
    try {
      await adminApi.delete(`/authors/${author._id}`);
      setAuthors((current) => current.filter((item) => item._id !== author._id));
    } catch {
      setError('The author could not be deleted. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Newsroom</p>
          <h1 className="text-3xl font-bold mt-1">Authors</h1>
          <p className="text-gray-600 mt-1">Manage the bylines and profiles shown across Eastern Newspaper.</p>
        </div>
        <Link href="/admin/authors/new" className="inline-flex w-fit items-center rounded bg-brand-blue px-4 py-2.5 font-semibold text-white hover:bg-brand-blue-dark">
          <span className="mr-2 text-lg leading-none">+</span> New author
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="author-search" className="sr-only">Search authors</label>
          <input id="author-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search authors..." className="w-full rounded border bg-white px-3 py-2.5 pl-10 text-sm shadow-sm" />
          <span aria-hidden="true" className="absolute left-3 top-2.5 text-gray-400">⌕</span>
        </div>
        <p className="text-sm text-gray-500">{filteredAuthors.length} {filteredAuthors.length === 1 ? 'author' : 'authors'}</p>
      </div>

      {error && <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="p-4">Author</th><th className="p-4">Title / role</th><th className="p-4">Profile URL</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="p-10 text-center text-gray-500">Loading authors...</td></tr>}
            {!loading && filteredAuthors.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-500">{query ? 'No authors match your search.' : 'No authors yet. Create the first one.'}</td></tr>}
            {!loading && filteredAuthors.map((author) => (
              <tr key={author._id} className="border-t hover:bg-gray-50">
                <td className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue text-sm font-bold text-white">{author.photo ? <img src={author.photo} alt="" className="h-full w-full object-cover" /> : author.name.charAt(0).toUpperCase()}</div><div><div className="font-semibold">{author.name}</div><div className="text-xs text-gray-500">{author.bio ? `${author.bio.slice(0, 58)}${author.bio.length > 58 ? '…' : ''}` : 'No bio added'}</div></div></div></td>
                <td className="p-4 text-gray-600">{author.title || 'Staff Writer'}</td>
                <td className="p-4 font-mono text-xs text-gray-500">/authors/{author.slug}</td>
                <td className="p-4 text-right"><Link href={`/admin/authors/${author._id}/edit`} className="mr-4 font-semibold text-brand-blue hover:underline">Edit</Link><button onClick={() => remove(author)} className="font-semibold text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
