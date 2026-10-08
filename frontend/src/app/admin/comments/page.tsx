'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import adminApi from '@/lib/adminApi';
import { Comment } from '@/types';

type Filter = 'all' | 'approved' | 'pending' | 'rejected';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Published' },
  { value: 'pending', label: 'Awaiting review' },
  { value: 'rejected', label: 'Hidden' },
];

/**
 * Reader-comment moderation. Comments publish immediately by default, so this
 * page is the safety net: it lists everything readers have written and lets an
 * editor hide or delete anything that breaks the house rules. Deleting also
 * keeps the article's public comment count honest.
 */
export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const query = filter === 'all' ? '' : `?status=${filter}`;

    adminApi
      .get(`/comments${query}`)
      .then((res) => {
        if (cancelled) return;
        setComments(res.data.data);
        setError('');
      })
      .catch(() => {
        if (!cancelled) setError('Could not load comments.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const setStatus = async (comment: Comment, status: 'approved' | 'rejected') => {
    setBusyId(comment._id);
    try {
      await adminApi.put(`/comments/${comment._id}/status`, { status });
      // "All" keeps the row (with its new badge); a filtered view drops it.
      if (filter === 'all') {
        setComments((prev) => prev.map((c) => (c._id === comment._id ? { ...c, status } : c)));
      } else {
        setComments((prev) => prev.filter((c) => c._id !== comment._id));
      }
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (comment: Comment) => {
    if (!confirm('Delete this comment for good?')) return;
    setBusyId(comment._id);
    try {
      await adminApi.delete(`/comments/${comment._id}`);
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Comments</h1>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded px-3 py-1.5 text-sm font-semibold ${
                filter === option.value
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-gray-700 shadow'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Reader</th>
            <th className="p-3">Comment</th>
            <th className="p-3">Article</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => {
            const article = typeof comment.article === 'object' ? comment.article : null;
            const status = comment.status || 'approved';
            return (
              <tr key={comment._id} className="border-t align-top">
                <td className="p-3">
                  <p className="font-semibold">{comment.name}</p>
                  {comment.email && <p className="text-xs text-gray-500">{comment.email}</p>}
                  <p className="text-xs text-gray-400">
                    {comment.createdAt ? format(new Date(comment.createdAt), 'd MMM yyyy, HH:mm') : ''}
                  </p>
                </td>
                <td className="p-3 max-w-md whitespace-pre-line break-words">{comment.body}</td>
                <td className="p-3">
                  {article ? (
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="text-brand-blue hover:underline"
                    >
                      {article.title}
                    </Link>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={
                      status === 'approved'
                        ? 'text-green-600'
                        : status === 'pending'
                          ? 'text-amber-600'
                          : 'text-gray-400'
                    }
                  >
                    {status === 'approved' ? 'Published' : status === 'pending' ? 'Awaiting review' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3 space-x-3 whitespace-nowrap">
                  {status !== 'approved' && (
                    <button
                      onClick={() => setStatus(comment, 'approved')}
                      disabled={busyId === comment._id}
                      className="text-green-700 hover:underline disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  {status !== 'rejected' && (
                    <button
                      onClick={() => setStatus(comment, 'rejected')}
                      disabled={busyId === comment._id}
                      className="text-amber-700 hover:underline disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => remove(comment)}
                    disabled={busyId === comment._id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loading && <p className="mt-4 text-sm text-gray-500">Loading…</p>}
      {!loading && comments.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No comments {filter === 'all' ? 'yet' : 'in this view'}.
        </p>
      )}
    </div>
  );
}
