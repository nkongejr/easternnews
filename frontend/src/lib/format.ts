import { format, isValid, parseISO } from 'date-fns';
import { Article, Author } from '@/types';
import { CATEGORY_COLORS, DEFAULT_ACCENT, COUNTIES, SITE } from './constants';

/** Safely turn a Mongo/ISO date string into a Date (or null). */
export function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : parseISO(String(value));
  return isValid(d) ? d : null;
}

export function formatDate(value?: string | Date | null, pattern = 'MMM d, yyyy'): string {
  const d = toDate(value);
  return d ? format(d, pattern) : '';
}

export function formatDateLong(value?: string | Date | null): string {
  return formatDate(value, 'MMMM d, yyyy');
}

/** "2 min read" — used in article metadata. */
export function readingTime(body?: string): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function isAuthorObject(author: Author | null | undefined): author is Author {
  return Boolean(author && typeof author === 'object' && author.name);
}

/** Ordered author objects, with a legacy single-author fallback. */
export function articleAuthors(article: Article): Author[] {
  const authors = (article.authors || []).filter(isAuthorObject);
  if (authors.length > 0) return authors;
  return isAuthorObject(article.author) ? [article.author] : [];
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] || '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Extra newsroom/byline credit, omitted when it duplicates an author name. */
export function bylineCredit(article: Article): string | null {
  const credit = article.bylineCredit?.trim();
  if (!credit) return null;

  const authorNames = articleAuthors(article).map((author) => author.name.trim()).filter(Boolean);
  if (authorNames.length === 0) return null;

  const normalisedCredit = credit.toLowerCase();
  const duplicatesAuthor = authorNames.some((name) => name.toLowerCase() === normalisedCredit);
  const duplicatesJoinedAuthors = joinNames(authorNames).toLowerCase() === normalisedCredit;

  return duplicatesAuthor || duplicatesJoinedAuthors ? null : credit;
}

/** Byline shown on cards and article pages, without the leading "By". */
export function byline(article: Article): string {
  const names = articleAuthors(article).map((author) => author.name).filter(Boolean);

  if (names.length === 0) {
    return article.bylineCredit?.trim() || 'Eastern Newspaper Team';
  }

  const authorText = joinNames(names);
  const credit = bylineCredit(article);
  return credit ? `${authorText} ${credit}` : authorText;
}

/** Card excerpt: prefer the editor-written deck, fall back to the lede. */
export function excerpt(article: Article, length = 150): string {
  const source = article.deck?.trim()
    ? article.deck
    : (article.body || '').replace(/\s+/g, ' ').trim();
  if (!source) return '';
  if (source.length <= length) return source;
  return `${source.slice(0, length).trimEnd()}…`;
}

export function categoryColor(category?: string): string {
  return (category && CATEGORY_COLORS[category]) || DEFAULT_ACCENT;
}

/** '/counties/meru' for a county name, otherwise undefined. */
export function countyHref(category?: string): string | undefined {
  const match = COUNTIES.find((c) => c.name === category);
  return match ? `/counties/${match.slug}` : undefined;
}

export function articleHref(article: Pick<Article, 'slug'>): string {
  return `/articles/${article.slug}`;
}

/**
 * Dates rendered by the server use a fixed locale/timezone so the HTML is
 * deterministic (no hydration mismatch, no locale drift between renders).
 */
export function formatToday(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy');
}

/** Make a CMS/relative URL absolute — required for OG images and structured data. */
export function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * True when `updatedAt` is at least a day after publication — the threshold
 * below which a save is just an edit, not a material update readers need to see.
 */
export function hasMaterialUpdate(publishDate?: string, updatedAt?: string): boolean {
  const p = toDate(publishDate);
  const u = toDate(updatedAt);
  if (!p || !u) return false;
  return u.getTime() - p.getTime() > 86_400_000;
}
