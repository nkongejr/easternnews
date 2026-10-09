import { api, safe } from '@/lib/api';
import { SITE } from '@/lib/constants';
import { Article } from '@/types';

/**
 * Google News sitemap — tells Google which stories are fresh news.
 *
 * Follows Google's current news sitemap requirements (developers.google.com/
 * search/docs/crawling-indexing/sitemaps/news-sitemap):
 * - only articles created within the last two days (older URLs are dropped
 *   automatically as the window slides);
 * - required per-URL tags: news:publication (name + language),
 *   news:publication_date (original publish time, W3C/ISO 8601) and
 *   news:title matching the visible headline;
 * - at most 1,000 news:news tags per file;
 * - the file may be empty when nothing was published in the window — that is
 *   valid and Search Console's "empty sitemap" note is expected, not an error.
 *
 * Google News crawls news sitemaps as often as the rest of the site; the
 * route itself revalidates every 30 minutes so new stories appear without a
 * redeploy. Publication name must match the name readers see on the articles.
 */
export const revalidate = 1800;

const WINDOW_MS = 48 * 60 * 60 * 1000; // "last two days"
const MAX_ENTRIES = 1000; // hard Google cap per file
const PAGE_SIZE = 50;
const MAX_PAGES = 10; // 500 newest stories is ample cover for a 48h window

/** Escape text for use inside XML elements and attributes. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const cutoff = Date.now() - WINDOW_MS;
  const recent: Article[] = [];
  let exhausted = false;

  for (let page = 1; page <= MAX_PAGES && recent.length < MAX_ENTRIES && !exhausted; page += 1) {
    const result = await safe(
      api.getArticles({ limit: String(PAGE_SIZE), page: String(page) }),
      null,
    );
    if (!result || result.data.length === 0) break;

    for (const article of result.data) {
      const published = Date.parse(article.publishDate || article.createdAt || '');
      if (!Number.isFinite(published)) continue;
      if (published < cutoff) {
        // The list is newest-first, so everything after this is out of window.
        exhausted = true;
        break;
      }
      recent.push(article);
    }

    if (page >= result.totalPages) break;
  }

  const entries = recent
    .map((article) => {
      const published = article.publishDate || article.createdAt || '';
      return [
        '  <url>',
        `    <loc>${xmlEscape(`${SITE.url}/articles/${article.slug}`)}</loc>`,
        '    <news:news>',
        '      <news:publication>',
        `        <news:name>${xmlEscape(SITE.name)}</news:name>`,
        '        <news:language>en</news:language>',
        '      </news:publication>',
        `      <news:publication_date>${xmlEscape(published)}</news:publication_date>`,
        `      <news:title>${xmlEscape(article.title)}</news:title>`,
        '    </news:news>',
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
