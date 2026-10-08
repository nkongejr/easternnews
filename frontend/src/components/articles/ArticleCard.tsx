import Link from 'next/link';
import { Article } from '@/types';
import { articleHref, excerpt } from '@/lib/format';
import CategoryBadge from './CategoryBadge';
import ArticleMeta from './ArticleMeta';
import SmartImage from '@/components/shared/SmartImage';

export type CardVariant = 'featured' | 'default' | 'compact' | 'text' | 'list';

const SIZES: Record<CardVariant, string> = {
  featured: '(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 780px',
  default: '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 380px',
  compact: '120px',
  text: '0px',
  list: '(max-width: 639px) 40vw, 220px',
};

/** Shared headline treatment: display serif, squared-off ink, blue on hover. */
const HEADLINE = 'font-headline font-bold tracking-[-0.015em] text-headline';
const HOVER = 'transition-colors hover:text-brand-primary';
/** Standfirsts are set in the reading serif, like a printed deck. */
const DECK = 'font-read leading-relaxed text-muted';

/**
 * The single article card used everywhere on the site.
 *
 * Variants
 *  - featured : lead story — 16/10 image, large headline, deck
 *  - default  : standard grid card — category overlay on image, headline, excerpt
 *  - compact  : sidebar / side-list — 4/3 thumb beside a two-line headline
 *  - text     : headline-only list item (no image)
 *  - list     : horizontal search/archive row
 */
export default function ArticleCard({
  article,
  variant = 'default',
  showExcerpt = true,
  showComments = false,
  priority = false,
  headingLevel,
}: {
  article: Article;
  variant?: CardVariant;
  showExcerpt?: boolean;
  showComments?: boolean;
  priority?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3';
}) {
  const href = articleHref(article);
  const lede = excerpt(article, variant === 'featured' ? 220 : 130);
  const H = headingLevel ?? (variant === 'featured' ? 'h2' : 'h3');

  if (variant === 'text') {
    return (
      <article className="group border-b border-border pb-3 last:border-0 last:pb-0">
        <h3 className={`${HEADLINE} text-[15px] leading-snug`}>
          <Link href={href} className={`line-clamp-2 ${HOVER}`}>
            {article.title}
          </Link>
        </h3>
        <ArticleMeta article={article} showAuthor={false} className="mt-1.5" />
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3.5 border-b border-border pb-3.5 last:border-0 last:pb-0">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="en-imgframe en-imgframe--framed aspect-[4/3] w-24 shrink-0 sm:w-28"
        >
          <SmartImage
            src={article.featuredImage?.url}
            alt=""
            sizes={SIZES.compact}
            loading="lazy"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <CategoryBadge category={article.category} />
          <h3 className={`${HEADLINE} mt-2 text-[15px] leading-snug`}>
            <Link href={href} className={`line-clamp-3 ${HOVER}`}>
              {article.title}
            </Link>
          </h3>
          <ArticleMeta article={article} showAuthor={false} className="mt-2" />
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className="group flex gap-4 border-b border-border py-5 first:pt-0 last:border-0 sm:gap-5">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="en-imgframe en-imgframe--framed aspect-[16/10] w-32 shrink-0 sm:w-48"
        >
          <SmartImage src={article.featuredImage?.url} alt="" sizes={SIZES.list} />
        </Link>
        <div className="min-w-0 flex-1">
          <CategoryBadge category={article.category} />
          <H className={`${HEADLINE} mt-2 text-lg leading-snug sm:text-xl`}>
            <Link href={href} className={`line-clamp-3 ${HOVER}`}>
              {article.title}
            </Link>
          </H>
          {showExcerpt && lede && (
            <p className={`${DECK} mt-2 hidden line-clamp-2 text-sm sm:block`}>{lede}</p>
          )}
          <ArticleMeta article={article} showComments={showComments} className="mt-2.5" />
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group">
        <div className="relative">
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            className="en-imgframe en-imgframe--framed block aspect-[16/10] w-full"
          >
            <SmartImage
              src={article.featuredImage?.url}
              alt=""
              sizes={SIZES.featured}
              priority={priority}
            />
          </Link>
          <div className="absolute bottom-3 left-3">
            <CategoryBadge category={article.category} size="md" />
          </div>
        </div>
        <div className="pt-4">
          <H className={`${HEADLINE} text-[26px] font-black leading-[1.12] sm:text-[32px]`}>
            <Link href={href} className={`line-clamp-3 ${HOVER}`}>
              {article.title}
            </Link>
          </H>
          {showExcerpt && lede && (
            <p className={`${DECK} mt-3 line-clamp-3 text-[15px] sm:text-base`}>{lede}</p>
          )}
          <ArticleMeta
            article={article}
            showComments={showComments}
            showReadTime
            className="mt-3.5 border-t border-border pt-3"
          />
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      <div className="relative">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="en-imgframe en-imgframe--framed block aspect-[16/9] w-full"
        >
          <SmartImage src={article.featuredImage?.url} alt="" sizes={SIZES.default} />
        </Link>
        <div className="absolute bottom-2 left-2">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="pt-3.5">
        <H className={`${HEADLINE} text-[19px] leading-[1.22]`}>
          <Link href={href} className={`line-clamp-3 ${HOVER}`}>
            {article.title}
          </Link>
        </H>
        {showExcerpt && lede && (
          <p className={`${DECK} mt-2 line-clamp-2 text-[14px]`}>{lede}</p>
        )}
        <ArticleMeta article={article} showComments={showComments} className="mt-2.5" />
      </div>
    </article>
  );
}
