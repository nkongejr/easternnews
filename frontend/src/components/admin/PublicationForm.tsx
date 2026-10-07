'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import PdfUploader from './PdfUploader';
import { Issue } from '@/types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const suggestedTitle = (issueNumber: string, month: string, year: string) => {
  const parts = [month.trim(), year.trim()].filter(Boolean).join(' ');
  if (!issueNumber.trim()) return parts;
  return `Issue ${issueNumber.trim()}${parts ? `, ${parts}` : ''}`;
};

/**
 * Create/edit form for a print edition.
 *
 * The edition number, its cover and the PDF link are what the public
 * /publications library renders, so those are the fields the form makes
 * hard to get wrong: the title auto-fills from the date, the PDF link is
 * validated as a public address, and "current issue" is exclusive.
 */
export default function PublicationForm({ initial }: { initial?: Issue }) {
  const router = useRouter();
  const [form, setForm] = useState({
    issueNumber: initial?.issueNumber ? String(initial.issueNumber) : '',
    title: initial?.title || '',
    month: initial?.month || '',
    year: initial?.year ? String(initial.year) : String(new Date().getFullYear()),
    coverHeadline: initial?.coverHeadline || '',
    coverImage: initial?.coverImage || '',
    pdfUrl: initial?.pdfUrl || '',
    isCurrent: initial?.isCurrent || false,
  });
  const [titleEdited, setTitleEdited] = useState(Boolean(initial?.title));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      // Keep the auto-generated title in step until an editor types their own.
      if (!titleEdited && field !== 'title') {
        next.title = suggestedTitle(next.issueNumber, next.month, next.year);
      }
      return next;
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const issueNumber = Number(form.issueNumber);
    const year = Number(form.year);
    const pdfUrl = form.pdfUrl.trim();

    if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
      setError('Enter the edition number as a whole number, for example 32.');
      setSaving(false);
      return;
    }
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      setError('Enter the edition year as four digits, for example 2026.');
      setSaving(false);
      return;
    }
    if (pdfUrl && !/^https?:\/\//i.test(pdfUrl) && !/^\/(?!\/)/.test(pdfUrl)) {
      setError('The PDF link must be a public address (https://…) or a site path starting with /');
      setSaving(false);
      return;
    }

    const payload = {
      issueNumber,
      title: form.title.trim() || suggestedTitle(form.issueNumber, form.month, form.year),
      month: form.month.trim() || MONTHS[(new Date().getMonth())],
      year,
      coverHeadline: form.coverHeadline.trim(),
      coverImage: form.coverImage,
      pdfUrl,
      isCurrent: form.isCurrent,
    };

    try {
      if (initial) await adminApi.put(`/issues/${initial._id}`, payload);
      else await adminApi.post('/issues', payload);
      router.push('/admin/publications');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'The publication could not be saved. Please check the form and try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const previewTitle = form.title.trim() || suggestedTitle(form.issueNumber, form.month, form.year);

  return (
    <form onSubmit={onSubmit} className="max-w-3xl rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[1fr_220px]">
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="issue-number" className="mb-1.5 block text-sm font-semibold">
                Edition number <span className="text-red-600">*</span>
              </label>
              <input
                id="issue-number"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.issueNumber}
                onChange={(e) => update('issueNumber', e.target.value)}
                placeholder="e.g. 33"
                className="w-full rounded border px-3 py-2.5"
              />
            </div>
            <div>
              <label htmlFor="issue-month" className="mb-1.5 block text-sm font-semibold">
                Month(s) <span className="text-red-600">*</span>
              </label>
              <input
                id="issue-month"
                required
                list="issue-months"
                value={form.month}
                onChange={(e) => update('month', e.target.value)}
                placeholder="e.g. April-May"
                className="w-full rounded border px-3 py-2.5"
              />
              <datalist id="issue-months">
                {MONTHS.map((month) => (
                  <option key={month} value={month} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="issue-year" className="mb-1.5 block text-sm font-semibold">
                Year <span className="text-red-600">*</span>
              </label>
              <input
                id="issue-year"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                placeholder="2026"
                className="w-full rounded border px-3 py-2.5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="issue-title" className="mb-1.5 block text-sm font-semibold">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="issue-title"
              required
              value={form.title}
              onChange={(e) => {
                setTitleEdited(true);
                update('title', e.target.value);
              }}
              placeholder="e.g. Issue 33, June 2026"
              className="w-full rounded border px-3 py-2.5"
            />
            <p className="mt-1 text-xs text-gray-500">
              Shown on the card. Use <strong>Use suggested title</strong> to fill it from the issue
              number and date.
            </p>
            {previewTitle && previewTitle !== form.title && (
              <button
                type="button"
                onClick={() => {
                  setTitleEdited(true);
                  update('title', previewTitle);
                }}
                className="mt-1.5 text-xs font-semibold text-brand-blue hover:underline"
              >
                Use suggested title: “{previewTitle}”
              </button>
            )}
          </div>

          <div>
            <label htmlFor="issue-headline" className="mb-1.5 block text-sm font-semibold">
              Cover headline
            </label>
            <input
              id="issue-headline"
              value={form.coverHeadline}
              onChange={(e) => update('coverHeadline', e.target.value)}
              placeholder="e.g. Counties choking in massive debts"
              className="w-full rounded border px-3 py-2.5"
            />
            <p className="mt-1 text-xs text-gray-500">
              The splash line on the cover, repeated under the card title.
            </p>
          </div>

          <div className="rounded border border-dashed border-gray-300 p-4">
            <p className="text-sm font-semibold">Downloadable PDF</p>
            <p className="mb-3 mt-1 text-xs text-gray-500">
              Paste a public link to the print edition, or upload the file. Leave it empty and the
              card reads “PDF not available yet”.
            </p>

            <label htmlFor="issue-pdf-url" className="mb-1.5 block text-sm font-semibold">
              PDF link
            </label>
            <input
              id="issue-pdf-url"
              type="text"
              inputMode="url"
              value={form.pdfUrl}
              onChange={(e) => update('pdfUrl', e.target.value)}
              placeholder="https://example.com/eastern-issue-33.pdf"
              aria-describedby="issue-pdf-hint"
              className="w-full rounded border px-3 py-2.5"
            />
            <p id="issue-pdf-hint" className="mt-1 text-xs text-gray-500">
              Accepts a full public address, or a path such as <code>/pdfs/issue-33.pdf</code> for a
              file you have added to this website.
            </p>
            <div className="mt-3">
              <PdfUploader value={form.pdfUrl} onChange={(url) => update('pdfUrl', url)} />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded border bg-gray-50 p-4 text-sm">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(e) => update('isCurrent', e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-semibold">This is the current issue</span>
              <span className="mt-1 block text-xs text-gray-500">
                Marks the edition as current on the website and clears the flag from any other
                edition.
              </span>
            </span>
          </label>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold">Cover image</p>
          <ImageUploader value={form.coverImage} onChange={(url) => update('coverImage', url)} />
          <p className="mt-2 text-xs text-gray-500">
            Portrait crop works best — covers are shown at 3:4 on the public page.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-7 flex items-center gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-brand-blue px-5 py-2.5 font-semibold text-white hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : initial ? 'Save changes' : 'Publish publication'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/publications')}
          className="rounded border px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
