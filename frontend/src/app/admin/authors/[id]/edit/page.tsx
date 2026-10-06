'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import AuthorForm from '@/components/admin/AuthorForm';
import { Author } from '@/types';

export default function EditAuthorPage() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    adminApi.get(`/authors/id/${id}`).then((response) => setAuthor(response.data)).catch(() => setError('This author could not be found.'));
  }, [id]);

  if (error) return <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;
  if (!author) return <p className="text-gray-500">Loading author...</p>;

  return <div><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Authors</p><h1 className="mt-1 text-3xl font-bold">Edit author</h1><p className="mt-1 text-gray-600">Update {author.name}’s newsroom profile.</p></div><AuthorForm initial={author} /></div>;
}
