'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import PublicationForm from '@/components/admin/PublicationForm';
import { Issue } from '@/types';

export default function EditPublicationPage() {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    adminApi
      .get(`/issues/id/${id}`)
      .then((response) => setIssue(response.data))
      .catch(() => setError('This publication could not be found.'));
  }, [id]);

  if (error)
    return (
      <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );

  if (!issue) return <p className="text-gray-500">Loading publication...</p>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Publications</p>
        <h1 className="mt-1 text-3xl font-bold">Edit publication</h1>
        <p className="mt-1 text-gray-600">Update the cover, date and PDF for {issue.title}.</p>
      </div>
      <PublicationForm initial={issue} />
    </div>
  );
}
