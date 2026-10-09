import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

/**
 * robots.txt — crawlers are welcome everywhere except the newsroom admin.
 * CSS/JS/images are never blocked, so Googlebot can render pages properly,
 * and both sitemaps (evergreen + Google News) are declared on the serving
 * domain. The Yandex-only `host` directive was removed: it is not part of
 * the robots.txt standard Google parses and it pointed at the wrong domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/news-sitemap.xml`],
  };
}
