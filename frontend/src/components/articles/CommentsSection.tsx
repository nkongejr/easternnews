'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaRegComment } from 'react-icons/fa6';
import { Comment } from '@/types';
import { postArticleComment, readerCommentsUrl } from '@/lib/api';

const MAX_BODY = 2000;
const PAGE_SIZE = 10;

const inputCls =
  'w-full rounded-sm border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand-blue';
const labelCls = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?';
}

function relativeTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Reader comments for one article.
 *
 * The first page is rendered on the server (so the discussion is in the HTML
 * for search engines and loads with the story); posting happens here in the
 * browser and the new comment appears at the top immediately. Everything
 * degrades to a readable empty state if the API is unreachable.
 */
export default function CommentsSection({
  articleId,
  initialComments,
  total,
  totalPages,
}: {
  articleId: string;
  initialComments: Comment[];
  total: number;
  totalPages: number;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [count, setCount] = useState(total);
  const [pages, setPages] = useState(totalPages);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'posted' | 'error'>('idle');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [justPosted, setJustPosted] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');
    setNotice('');

    try {
      const result = await postArticleComment(articleId, { ...form, honeypot });
      setComments((prev) => [result.comment, ...prev]);
      setCount(result.commentCount ?? count + 1);
      setJustPosted(result.comment._id);
      setForm({ name: '', email: '', body: '' });
      setStatus('posted');
      setNotice(result.message || 'Thank you — your comment has been posted.');
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error
          ? err.message
          : 'Your comment could not be posted. Please try again.',
      );
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    setError('');
    try {
      const res = await fetch(
        `${readerCommentsUrl(articleId)}&page=${page + 1}&limit=${PAGE_SIZE}`,
      );
      const data = (await res.json().catch(() => null)) as {
        data: Comment[];
        page: number;
        totalPages: number;
        message?: string;
      } | null;
      if (!res.ok || !data) {
        throw new Error(data?.message || 'Could not load more comments.');
      }
      setComments((prev) => [
        ...prev,
        ...data.data.filter((item) => !prev.some((existing) => existing._id === item._id)),
      ]);
      setPage(data.page);
      setPages(data.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load more comments. Please try again.',
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const remaining = Math.max(count - comments.length, 0);

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="mt-10 scroll-mt-24 border-t border-border pt-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="comments-heading"
          className="flex items-center gap-2 font-headline text-xl font-black text-text"
        >
          <FaRegComment size={16} className="text-brand-primary" aria-hidden="true" />
          Comments
          {count > 0 && <span className="text-muted">({count})</span>}
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Join the discussion
        </p>
      </div>

      <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
        Anyone can leave a comment on this story. Keep it civil and on the story — comments that
        break our house rules are removed.
      </p>

      {/* Post a comment */}
      <form onSubmit={onSubmit} className="mt-5 border border-border bg-surface-alt p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="comment-name" className={labelCls}>
              Your name <span className="text-state-error">*</span>
            </label>
            <input
              id="comment-name"
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Jane Wanjiru"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="comment-email" className={labelCls}>
              Email <span className="font-normal normal-case tracking-normal text-muted">(not published)</span>
            </label>
            <input
              id="comment-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="comment-body" className={labelCls}>
              Your comment <span className="text-state-error">*</span>
            </label>
            <span className="text-[11px] text-muted">
              {form.body.length}/{MAX_BODY}
            </span>
          </div>
          <textarea
            id="comment-body"
            name="body"
            required
            minLength={2}
            maxLength={MAX_BODY}
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Share your view on this story…"
            className={inputCls}
          />
        </div>

        {/* Hidden from readers; bots fill it in and are dropped silently. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="comment-website">Website</label>
          <input
            id="comment-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="h-11 rounded-sm bg-brand-primary px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {status === 'sending' ? 'Posting…' : 'Post comment'}
          </button>
          <p className="text-[11px] text-muted">
            Your name and comment appear publicly. We never publish your email.
          </p>
        </div>

        <p aria-live="polite" className="mt-2 min-h-4 text-[12px]">
          {status === 'posted' && <span className="font-semibold text-green-700">{notice}</span>}
          {status === 'error' && <span className="font-semibold text-state-error">{error}</span>}
        </p>
      </form>

      {/* The discussion */}
      {comments.length > 0 ? (
        <>
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {comments.map((comment) => (
              <li key={comment._id} className="flex gap-3 py-4">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[12px] font-bold uppercase text-white"
                >
                  {initials(comment.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-muted">
                    <span className="font-bold text-text">{comment.name}</span>
                    <time dateTime={comment.createdAt} suppressHydrationWarning>
                      {relativeTime(comment.createdAt)}
                    </time>
                    {justPosted === comment._id && (
                      <span className="rounded-sm bg-brand-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-primary-darker">
                        Just posted
                      </span>
                    )}
                  </p>
                  <p className="mt-1 whitespace-pre-line break-words text-[14px] leading-relaxed text-text">
                    {comment.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {(page < pages || remaining > 0) && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-4 h-10 w-full rounded-sm border border-border-strong bg-white text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-surface-alt disabled:opacity-60"
            >
              {loadingMore ? 'Loading…' : `Load more comments${remaining ? ` (${remaining})` : ''}`}
            </button>
          )}
        </>
      ) : (
        <p className="mt-6 border border-dashed border-border bg-surface-alt p-5 text-center text-[13px] text-muted">
          No comments yet — be the first to share your view on this story.
        </p>
      )}
    </section>
  );
}
