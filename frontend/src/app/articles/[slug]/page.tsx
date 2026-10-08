import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api, safe, EMPTY_COMMENTS } from '@/lib/api';
import {
  absoluteUrl,
  articleAuthors,
  byline,
  bylineCredit,
  formatDateLong,
  hasMaterialUpdate,
  readingTime,
} from '@/lib/format';
import { SITE } from '@/lib/constants';
import CategoryBadge from '@/components/articles/CategoryBadge';
import { categoryRoute } from '@/lib/routes';
import ArticleBody from '@/components/articles/ArticleBody';
import ArticleInlineAd from '@/components/articles/ArticleInlineAd';
import ArticleOverlayAd from '@/components/articles/ArticleOverlayAd';
import CommentsSection from '@/components/articles/CommentsSection';
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
    const description =
      article.seoDescription || article.deck || (article.body ? article.body.slice(0, 155) : '');
    const image = absoluteUrl(article.featuredImage?.url);
    const keywords = article.seoKeywords
      ? article.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : article.tags;
    return {
      title: article.seoTitle || article.title,
      description,
      keywords,
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
  const authors = articleAuthors(article);
  const credit = bylineCredit(article);
  const authorTitles = Array.from(new Set(
    authors.map((item) => item.title).filter((title): title is string => Boolean(title)),
  ));
  const mins = readingTime(article.body);
  const isOpinion = article.category === 'Opinion' || article.category === 'Editorial';
  const showUpdated = hasMaterialUpdate(article.publishDate, article.updatedAt);

  // More stories from the same desk/county.
  const more = await safe(
    api.getArticles({ category: article.category, limit: '7' }),
    { data: [], page: 1, totalPages: 0, totalResults: 0 },
  );
  const moreStories = more.data.filter((a) => a._id !== article._id && a.slug !== slug).slice(0, 3);

  // Reader comments. Non-critical: an unreachable/older API leaves the section
  // in its empty state instead of taking the article down — but say so in the
  // server log, where whoever deploys can see that the API is behind.
  let comments = EMPTY_COMMENTS;
  try {
    comments = await api.getArticleComments(article._id, { limit: '10' });
  } catch (error) {
    console.warn(
      `[article] comments unavailable for /articles/${slug}:`,
      error instanceof Error ? error.message : error,
    );
  }

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    ...(categoryLink ? [{ label: article.category, href: categoryLink }] : []),
    { label: article.title },
  ];

  const structuredAuthors = authors.length > 0
    ? authors.map((item) => ({
        '@type': 'Person',
        name: item.name,
        ...(item.slug ? { url: `${SITE.url}/authors/${item.slug}` } : {}),
      }))
    : [{ '@type': 'Person', name: author }];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': isOpinion ? 'OpinionNewsArticle' : 'NewsArticle',
    headline: article.title,
    description: article.deck || (article.body ? article.body.slice(0, 200) : undefined),
    image: absoluteUrl(article.featuredImage?.url) ? [absoluteUrl(article.featuredImage?.url)] : undefined,
    datePublished: article.publishDate,
    dateModified: article.updatedAt || article.publishDate,
    author: structuredAuthors.length === 1 ? structuredAuthors[0] : structuredAuthors,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: article.category,
    commentCount: comments.totalResults || undefined,
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
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-y border-border py-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[13px]">
              {authors.length > 0 ? (
                <span className="font-bold text-text">
                  By{' '}
                  {authors.map((item, index) => (
                    <Fragment key={item._id || item.slug || item.name}>
                      {index > 0 ? (index === authors.length - 1 ? ' and ' : ', ') : ''}
                      {item.slug ? (
                        <Link href={`/authors/${item.slug}`} className="hover:text-brand-primary">
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </Fragment>
                  ))}
                  {credit ? ` ${credit}` : ''}
                </span>
              ) : (
                <span className="font-bold text-text">By {author}</span>
              )}
              {authorTitles.length > 0 && (
                <span className="block text-[11px] text-muted">{authorTitles.join(' · ')}</span>
              )}
            </p>
            <p className="text-[12px] text-muted">
              {article.publishDate && (
                <time dateTime={article.publishDate}>{formatDateLong(article.publishDate)}</time>
              )}
              <span className="mx-1.5">·</span>
              {mins} min read
              <span className="mx-1.5">·</span>
              <a href="#comments" className="font-semibold hover:text-brand-primary hover:underline">
                {comments.totalResults > 0
                  ? `${comments.totalResults} ${comments.totalResults === 1 ? 'comment' : 'comments'}`
                  : 'Add a comment'}
              </a>
            </p>
            {categoryLink && (
              <Link
                href={categoryLink}
                className="text-[12px] font-semibold text-brand-primary hover:underline"
              >
                {article.category}
              </Link>
            )}
          </div>
          <ShareButtons title={article.title} url={url} compact />
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

        {/* Body — with the in-article advert slotted between paragraphs */}
        <div className="mt-6">
          {article.body ? (
            <ArticleBody body={article.body} inlineAd={<ArticleInlineAd />} />
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

        {/* Below the story: the comment section for this article */}
        <CommentsSection
          articleId={article._id}
          initialComments={comments.data}
          total={comments.totalResults}
          totalPages={comments.totalPages}
        />

        <RelatedArticles articles={article.relatedArticles || []} />

        {moreStories.length > 0 && (
          <section className="mt-12" aria-labelledby="more-from">
            <div id="more-from">
              <SectionHeader
                title={`More from ${article.category}`}
                href={categoryLink ?? undefined}
                accent="var(--brand-primary)"
                variant="bar"
              />
            </div>
            <div className="mt-5">
              <NewsGrid articles={moreStories} columns={3} />
            </div>
          </section>
        )}
      </article>

      <Sidebar />

      {/* Advert that closes over the story while it is being read. */}
      <ArticleOverlayAd />

      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
    </div>
  );
}
