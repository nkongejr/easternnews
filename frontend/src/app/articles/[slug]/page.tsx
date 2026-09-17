import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatDateLong, readingTime } from '@/lib/format';
import CategoryBadge, { categoryHref } from '@/components/articles/CategoryBadge';
import ArticleBody from '@/components/articles/ArticleBody';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ShareButtons from '@/components/shared/ShareButtons';
import Breadcrumbs, { type Crumb } from '@/components/shared/Breadcrumbs';
import SmartImage from '@/components/shared/SmartImage';
import Sidebar from '@/components/sidebar/Sidebar';

// Kept dynamic so the API's view counter registers every read.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://easternnews.vercel.app';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const article = await api.getArticleBySlug(slug);
    return {
      title: article.title,
      description: article.deck || (article.body ? article.body.slice(0, 150) : ''),
      openGraph: {
        title: article.title,
        description: article.deck,
        images: article.featuredImage?.url ? [article.featuredImage.url] : [],
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

  const url = `${SITE_URL}/articles/${slug}`;
  const categoryLink = categoryHref(article.category);

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    ...(categoryLink ? [{ label: article.category, href: categoryLink }] : []),
    { label: article.title },
  ];

  const mins = readingTime(article.body);

  return (
    <div className="en-container grid gap-10 py-6 md:py-8 lg:grid-cols-3 lg:gap-12">
      <article className="min-w-0 lg:col-span-2">
        <Breadcrumbs items={crumbs} />

        <CategoryBadge category={article.category} size="md" />

        <h1 className="mt-3 font-headline text-[28px] font-black leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[42px]">
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
            <span className="font-bold text-ink">
              By {article.author?.name || article.bylineCredit || 'Eastern Newspaper Team'}
            </span>
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

        {/* Lead image */}
        <figure className="mt-6">
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
                  className="inline-block rounded-sm bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:bg-brand-blue hover:text-white"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ShareButtons title={article.title} url={url} />

        <RelatedArticles articles={article.relatedArticles || []} />
      </article>

      <Sidebar />
    </div>
  );
}
