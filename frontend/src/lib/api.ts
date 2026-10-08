import {
  Article,
  Author,
  Category,
  PaginatedArticles,
  Advertiser,
  Issue,
  PaginatedComments,
  CommentPostResult,
} from '@/types';

const API_URL =
  (typeof window === 'undefined' && process.env.API_INTERNAL_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api';

/**
 * Server components talk to the API directly; the browser always calls
 * same-origin `/api`, which the Next rewrites proxy to the Express API. That
 * keeps reader-facing calls (comments, contact form) working from any device,
 * never from the reader's own localhost.
 */
export function apiUrl(path: string): string {
  return typeof window === 'undefined' ? `${API_URL}${path}` : `/api${path}`;
}

async function fetchJSON<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(apiUrl(path), {
    next: { revalidate },
    signal: AbortSignal.timeout(20000), // 20s timeout instead of default
  });
  if (res.status === 404) {
    const err = new Error('Not Found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return res.json();
}

export const api = {
  getCategories: (type?: 'county' | 'section') =>
    fetchJSON<Category[]>(`/categories${type ? `?type=${type}` : ''}`),

  getCategoryBySlug: (slug: string) => fetchJSON<Category>(`/categories/${slug}`),

  getArticles: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON<PaginatedArticles>(`/articles${qs ? `?${qs}` : ''}`);
  },

  getArticleBySlug: (slug: string) => fetchJSON<Article>(`/articles/${slug}`, 0),

  getMostRead: (limit = 5) => fetchJSON<Article[]>(`/articles/most-read?limit=${limit}`),

  getAuthorBySlug: (slug: string) => fetchJSON<Author>(`/authors/${slug}`),

  getCurrentIssue: () => fetchJSON<Issue>('/issues/current'),

  // Editions are published from the newsroom dashboard, so the library always
  // requests the list fresh — an editor who publishes an issue must see it.
  getIssues: () => fetchJSON<Issue[]>('/issues', 0),

  getAdvertisers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON<Advertiser[]>(`/advertisers${qs ? `?${qs}` : ''}`);
  },

  /** Approved reader comments for one article (id or slug), newest first. */
  getArticleComments: (articleId: string, params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON<PaginatedComments>(
      `/articles/${encodeURIComponent(articleId)}/comments${qs ? `?${qs}` : ''}`,
      0,
    );
  },
};

/**
 * Reader-facing comment endpoint (list + post). It is a same-origin Next route
 * rather than the raw API rewrite so the browser always gets JSON, and a
 * restarting API shows a readable message instead of a broken form.
 */
export function readerCommentsUrl(articleId: string): string {
  return `/api/reader-comments?articleId=${encodeURIComponent(articleId)}`;
}

export const EMPTY_COMMENTS: PaginatedComments = {
  data: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
};

/**
 * Post a reader comment. Called from the browser, so it goes through the
 * same-origin `/api/reader-comments` route, which always answers in JSON — the
 * API's own validation message is surfaced to the reader, and a brief API
 * restart is retried once instead of being reported as a failure.
 */
export async function postArticleComment(
  articleId: string,
  payload: { name: string; email?: string; body: string; honeypot?: string },
): Promise<CommentPostResult> {
  const send = () =>
    fetch(readerCommentsUrl(articleId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

  let res = await send();
  // A 5xx/503 means "try again in a moment", not "your comment is bad".
  if (res.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    res = await send();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { message?: string } | null)?.message ||
        'Your comment could not be posted. Please try again.',
    );
  }
  return data as CommentPostResult;
}

/**
 * Resolve a request to a fallback instead of throwing. Used for non-critical
 * homepage modules (issue strip, ad slots, sidebar widgets) so one slow or
 * failing endpoint can never take the whole page down.
 */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export const EMPTY_PAGE: PaginatedArticles = {
  data: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
};

export async function sendContactMessage(payload: {
  name: string; email: string; subject?: string; message: string;
}) {
  const res = await fetch(apiUrl('/contact'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(apiUrl('/contact/newsletter'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to subscribe');
  return res.json();
}