import { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { COUNTIES } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.easternnewspaper.co.ke';
  const { data: articles } = await api.getArticles({ limit: '100' });

  const articleUrls = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.publishDate,
  }));

  const countyUrls = COUNTIES.map((c) => ({
    url: `${base}/counties/${c.slug}`,
  }));

  const sectionUrls = [
    '/latest',
    '/business',
    '/sports',
    '/opinion',
    '/editorial',
    '/politics',
    '/technology',
    '/entertainment',
    '/lifestyle',
    '/about',
    '/advertise',
    '/advertisers',
    '/contact',
    '/archive',
    '/privacy',
    '/terms',
  ].map((path) => ({ url: `${base}${path}` }));

  return [
    { url: base },
    ...sectionUrls,
    ...countyUrls,
    ...articleUrls,
  ];
}