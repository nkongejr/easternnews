import { Article, Category, PaginatedArticles, Advertiser, Issue } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJSON<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
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

  getCurrentIssue: () => fetchJSON<Issue>('/issues/current'),

  getIssues: () => fetchJSON<Issue[]>('/issues'),

  getAdvertisers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON<Advertiser[]>(`/advertisers${qs ? `?${qs}` : ''}`);
  },
};

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
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_URL}/contact/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to subscribe');
  return res.json();
}