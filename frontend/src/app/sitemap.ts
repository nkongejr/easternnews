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

  return [
    { url: base },
    { url: `${base}/business` },
    { url: `${base}/sports` },
    { url: `${base}/opinion` },
    { url: `${base}/editorial` },
    { url: `${base}/about` },
    { url: `${base}/contact` },
    { url: `${base}/advertisers` },
    { url: `${base}/archive` },
    ...countyUrls,
    ...articleUrls,
  ];
}