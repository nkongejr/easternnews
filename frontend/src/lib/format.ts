import { format, isValid, parseISO } from 'date-fns';
import { Article } from '@/types';
import { CATEGORY_COLORS, DEFAULT_ACCENT, COUNTIES } from './constants';

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

/** Byline shown on cards and article pages. */
export function byline(article: Article): string {
  return article.author?.name || article.bylineCredit || 'Eastern Newspaper Team';
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
