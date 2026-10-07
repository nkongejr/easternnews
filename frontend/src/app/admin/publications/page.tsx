'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import adminApi from '@/lib/adminApi';
import SmartImage from '@/components/shared/SmartImage';
import { Issue } from '@/types';

/**
 * Publications manager — the print editions shown on /publications.
 * Upload a cover, add the PDF link and flag which edition is current; the
 * public library picks the change up on its next revalidation.
 */
export default function AdminPublicationsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    adminApi
      .get('/issues')
      .then(({ data }) => {
        if (active) setIssues(data);
      })
      .catch(() => {
        if (active) setError('We could not load the publications. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const editions = useMemo(
    () => [...issues].sort((a, b) => b.issueNumber - a.issueNumber),
    [issues]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return editions;
    return editions.filter((issue) =>
      [issue.title, issue.month, issue.coverHeadline, String(issue.issueNumber), String(issue.year)]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [editions, query]);

  const remove = async (issue: Issue) => {
    const confirmed = confirm(
      `Delete ${issue.title}? The stories in it stay published — they simply stop being credited to this edition.`
    );
    if (!confirmed) return;

    try {
      await adminApi.delete(`/issues/${issue._id}`);
      setIssues((current) => current.filter((item) => item._id !== issue._id));
    } catch {
      setError('The publication could not be deleted. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Newsroom</p>
          <h1 className="mt-1 text-3xl font-bold">Publications</h1>
          <p className="mt-1 text-gray-600">
            Manage the print editions listed on the public{' '}
            <Link href="/publications" className="font-semibold text-brand-blue hover:underline">
              Publications
            </Link>{' '}
            page — covers, dates and the downloadable PDF.
          </p>
        </div>
        <Link
          href="/admin/publications/new"
          className="inline-flex w-fit items-center rounded bg-brand-blue px-4 py-2.5 font-semibold text-white hover:bg-brand-blue-dark"
        >
          <span className="mr-2 text-lg leading-none">+</span> New publication
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="publication-search" className="sr-only">
            Search publications
          </label>
          <input
            id="publication-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by issue, title or month..."
            className="w-full rounded border bg-white px-3 py-2.5 pl-10 text-sm shadow-sm"
          />
          <span aria-hidden="true" className="absolute left-3 top-2.5 text-gray-400">
            ⌕
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'edition' : 'editions'}
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Edition</th>
              <th className="p-4">Cover headline</th>
              <th className="p-4">PDF</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  Loading publications...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  {query
                    ? 'No publications match your search.'
                    : 'No publications yet. Add the first edition.'}
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((issue) => (
                <tr key={issue._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="relative h-16 w-12 overflow-hidden rounded border bg-gray-100">
                      <SmartImage
                        src={issue.coverImage}
                        alt=""
                        sizes="48px"
                        imgClassName="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">
                      Issue {issue.issueNumber}
                      {issue.isCurrent && (
                        <span className="ml-2 rounded-sm bg-brand-gold px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-blue-darker">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {issue.month} {issue.year} · {issue.title}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {issue.coverHeadline ? (
                      <span className="line-clamp-2">{issue.coverHeadline}</span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="p-4">
                    {issue.pdfUrl ? (
                      <a
                        href={issue.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-blue hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-xs italic text-gray-500">No PDF yet</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/publications/${issue._id}/edit`}
                      className="mr-4 font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(issue)}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Tip: adding a public PDF link to an edition turns on the <strong>Download PDF</strong> button
        on its card. Editions without one show “PDF not available yet”.
      </p>
    </div>
  );
}
