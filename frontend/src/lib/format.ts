import { format, isValid, parseISO } from 'date-fns';
import { Article, Author } from '@/types';
import {
  BRAND,
  CATEGORY_COLORS,
  DEFAULT_ACCENT,
  COUNTIES,
  SITE,
  TOKEN_HEX,
  WHITE,
} from './constants';

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

/* ------------------------------------------------------------
   CONTRAST HELPERS

   The logo palette has one very useful property: navy is legible on
   all eight of the other colours (4.8:1 at worst), while the bright
   end — blue, cyan, lime, pale, ice — cannot carry white text at
   all. So instead of hard-coding which colour takes dark ink and
   which takes light, every coloured surface asks for the ink that
   actually passes. Adding a colour to CATEGORY_COLORS can therefore
   never silently produce unreadable text.
   ------------------------------------------------------------ */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Accepts either a hex colour or a token reference like
 * `var(--color-ink)` and returns a hex. Unrecognised tokens fall back to
 * navy — the palette's universal ink — so a typo degrades to a legible
 * default rather than an unreadable one.
 */
export function resolveColour(value: string): string {
  const token = /^var\(\s*(--[a-z0-9-]+)\s*\)$/i.exec(value.trim());
  if (!token) return value;
  return TOKEN_HEX[token[1]] || BRAND.navy;
}

/** WCAG relative luminance of a #rrggbb string (0 for anything else). */
export function relativeLuminance(hex: string): number {
  const h = hex.trim().replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(h)) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two #rrggbb strings (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** The ink — navy or white — that carries the most contrast on a fill. */
export function readableInk(background: string): string {
  return contrastRatio(background, WHITE) > contrastRatio(background, BRAND.navy)
    ? WHITE
    : BRAND.navy;
}

/** True for fills in the pale half of the palette (ice, pale, limes). */
export function isPaleFill(colour: string): boolean {
  return relativeLuminance(colour) > 0.5;
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
