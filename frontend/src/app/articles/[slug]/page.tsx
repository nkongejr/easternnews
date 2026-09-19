import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api, safe } from '@/lib/api';
import {
  absoluteUrl,
  byline,
  formatDateLong,
  hasMaterialUpdate,
  readingTime,
} from '@/lib/format';
import { SITE } from '@/lib/constants';
import CategoryBadge from '@/components/articles/CategoryBadge';
import { categoryRoute } from '@/lib/routes';
import ArticleBody from '@/components/articles/ArticleBody';
import RelatedArticles from '@/components/articles/RelatedArticles';
import NewsGrid from '@/components/articles/NewsGrid';
import ShareButtons from '@/components/shared/ShareButtons';
import Breadcrumbs, { type Crumb } from '@/components/shared/Breadcrumbs';
import SectionHeader from '@/components/shared/SectionHeader';
import SmartImage from '@/components/shared/SmartImage';
import JsonLd from '@/components/seo/JsonLd';
import Sidebar from '@/components/sidebar/Sidebar';

// Kept dynamic so the API's view counter registers every read.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const article = await api.getArticleBySlug(slug);
    const description = article.deck || (article.body ? article.body.slice(0, 155) : '');
    const image = absoluteUrl(article.featuredImage?.url);
    return {
      title: article.title,
      description,
      alternates: { canonical: `/articles/${slug}` },
      openGraph: {
        type: 'article' as const,
        title: article.title,
        description,
        url: `/articles/${slug}`,
        publishedTime: article.publishDate,
        modifiedTime: article.updatedAt || article.publishDate,
        section: article.category,
        tags: article.tags,
        images: image ? [{ url: image, alt: article.featuredImage?.caption || article.title }] : [],
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: article.title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await api.getArticleBySlug(slug);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 404) notFound();
    throw err;
  }

  const url = `${SITE.url}/articles/${slug}`;
  const categoryLink = categoryRoute(article.category);
  const author = byline(article);
  const mins = readingTime(article.body);
  const isOpinion = article.category === 'Opinion' || article.category === 'Editorial';
  const showUpdated = hasMaterialUpdate(article.publishDate, article.updatedAt);

  // More stories from the same desk/county.
  const more = await safe(
    api.getArticles({ category: article.category, limit: '7' }),
    { data: [], page: 1, totalPages: 0, totalResults: 0 },
  );
  const moreStories = more.data.filter((a) => a._id !== article._id && a.slug !== slug).slice(0, 3);

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    ...(categoryLink ? [{ label: article.category, href: categoryLink }] : []),
    { label: article.title },
  ];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': isOpinion ? 'OpinionNewsArticle' : 'NewsArticle',
    headline: article.title,
    description: article.deck || (article.body ? article.body.slice(0, 200) : undefined),
    image: absoluteUrl(article.featuredImage?.url) ? [absoluteUrl(article.featuredImage?.url)] : undefined,
    datePublished: article.publishDate,
    dateModified: article.updatedAt || article.publishDate,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: article.category,
    keywords: article.tags?.join(', '),
    isAccessibleForFree: true,
    inLanguage: 'en-KE',
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      ...(categoryLink
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: article.category,
              item: `${SITE.url}${categoryLink}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: categoryLink ? 3 : 2,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <div className="en-container grid gap-10 py-6 md:py-8 lg:grid-cols-3 lg:gap-12">
      <article className="min-w-0 lg:col-span-2">
        <Breadcrumbs items={crumbs} />

        <CategoryBadge category={article.category} size="md" />

        <h1 className="mt-3 font-headline text-[28px] font-black leading-[1.12] tracking-tight text-text sm:text-4xl lg:text-[42px]">
          {article.title}
        </h1>

        {article.deck && (
          <p className="mt-3 font-headline text-lg italic leading-relaxed text-muted md:text-xl">
            {article.deck}
          </p>
        )}

        {/* Byline bar */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3">
          <p className="text-[13px]">
            <span className="font-bold text-text">By {author}</span>
            {article.author?.title && (
              <span className="block text-[11px] text-muted">{article.author.title}</span>
            )}
          </p>
          <p className="text-[12px] text-muted">
            {article.publishDate && (
              <time dateTime={article.publishDate}>{formatDateLong(article.publishDate)}</time>
            )}
            {article.bylineCredit && article.bylineCredit !== (article.author?.name || '') && (
              <>
                <span className="mx-1.5">·</span>
                {article.bylineCredit}
              </>
            )}
            <span className="mx-1.5">·</span>
            {mins} min read
          </p>
        </div>

        {showUpdated && article.updatedAt && (
          <p className="mt-2 text-[12px] italic text-muted">
            Updated{' '}
            <time dateTime={article.updatedAt}>{formatDateLong(article.updatedAt)}</time>
          </p>
        )}

        {/* Lead image */}
        <figure className="mt-5">
          <div className="en-imgframe aspect-[16/9] w-full">
            <SmartImage
              src={article.featuredImage?.url}
              alt={article.featuredImage?.caption || article.title}
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
          </div>
          {(article.featuredImage?.caption || article.featuredImage?.credit) && (
            <figcaption className="mt-2 border-b border-border pb-2 text-[11px] leading-relaxed text-muted">
              {article.featuredImage?.caption}
              {article.featuredImage?.credit && (
                <>
                  {' '}
                  <span className="italic">— {article.featuredImage.credit}</span>
                </>
              )}
            </figcaption>
          )}
        </figure>

        {/* Body */}
        <div className="mt-6">
          {article.body ? (
            <ArticleBody body={article.body} />
          ) : (
            <p className="text-muted">This story is still being written.</p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <li key={t}>
                <Link
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="inline-block rounded-sm bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:bg-brand-primary hover:text-white"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ShareButtons title={article.title} url={url} />

        <RelatedArticles articles={article.relatedArticles || []} />

        {moreStories.length > 0 && (
          <section className="mt-12" aria-labelledby="more-from">
            <div id="more-from">
              <SectionHeader
                title={`More from ${article.category}`}
                href={categoryLink ?? undefined}
                accent="var(--brand-primary)"
              />
            </div>
            <NewsGrid articles={moreStories} columns={3} />
          </section>
        )}
      </article>

      <Sidebar />

      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
    </div>
  );
}
