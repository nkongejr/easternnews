'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';
import { Article } from '@/types';

export default function AdminArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);

  const load = () => adminApi.get('/articles?status=all&limit=50').then((res) => setArticles(res.data.data));

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await adminApi.delete(`/articles/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new" className="bg-brand-blue text-white px-4 py-2 rounded font-semibold">+ New Article</Link>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-3">{a.title}</td>
              <td className="p-3">{a.category}</td>
              <td className="p-3">
                <span className={a.status === 'published' ? 'text-green-600' : 'text-gray-400'}>{a.status}</span>
              </td>
              <td className="p-3 space-x-3">
                <Link href={`/admin/articles/${a._id}/edit`} className="text-brand-blue hover:underline">Edit</Link>
                <button onClick={() => remove(a._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}