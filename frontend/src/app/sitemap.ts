import { MetadataRoute } from 'next';
import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTIES, SITE } from '@/lib/constants';

/**
 * XML sitemap — the crawl map for everything indexable.
 *
 * All URLs are absolute canonicals on SITE.url (the serving domain) and point
 * only at pages that are indexable: /search is excluded (noindex utility
 * page), /admin is disallowed in robots.txt, and drafts never come back from
 * the public API. Recent articles also appear in /news-sitemap.xml, which is
 * the file Google News reads; this one is the evergreen archive.
 *
 * Freshness: regenerated at most hourly so newly published stories are
 * discoverable without a redeploy.
 */
export const revalidate = 3600;

type Section = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

/** Hand-maintained pages, most to least important for crawlers. */
const SECTIONS: Section[] = [
  { path: '/latest', priority: 0.9, changeFrequency: 'hourly' },
  { path: '/politics', priority: 0.8, changeFrequency: 'daily' },
  { path: '/business', priority: 0.8, changeFrequency: 'daily' },
  { path: '/sports', priority: 0.8, changeFrequency: 'daily' },
  { path: '/editorial', priority: 0.7, changeFrequency: 'daily' },
  { path: '/opinion', priority: 0.7, changeFrequency: 'daily' },
  { path: '/profiles', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/counties', priority: 0.8, changeFrequency: 'daily' },
  { path: '/technology', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/entertainment', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/lifestyle', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/publications', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/advertise', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/advertisers', priority: 0.3, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

/** How many pages of published stories to walk (50 per page). */
const MAX_ARTICLE_PAGES = 20;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Every published story, newest first — one URL each with its publish date
  // so crawlers can prioritise fresh reporting.
  const articles = [];
  for (let page = 1; page <= MAX_ARTICLE_PAGES; page += 1) {
    const result = await safe(
      api.getArticles({ limit: '50', page: String(page) }),
      EMPTY_PAGE,
    );
    articles.push(...result.data);
    if (page >= result.totalPages || result.data.length === 0) break;
  }

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE.url}/articles/${a.slug}`,
    lastModified: a.publishDate || a.updatedAt || a.createdAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const countyUrls: MetadataRoute.Sitemap = COUNTIES.map((c) => ({
    url: `${SITE.url}/counties/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const authorUrls: MetadataRoute.Sitemap = (await safe(api.getAuthors(), [])).map(
    (author) => ({
      url: `${SITE.url}/authors/${author.slug}`,
      changeFrequency: 'weekly',
      priority: 0.4,
    }),
  );

  const sectionUrls: MetadataRoute.Sitemap = SECTIONS.map((s) => ({
    url: `${SITE.url}${s.path}`,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  return [
    { url: SITE.url, changeFrequency: 'hourly', priority: 1 },
    ...sectionUrls,
    ...countyUrls,
    ...authorUrls,
    ...articleUrls,
  ];
}
