import Link from 'next/link';
import { Article } from '@/types';
import { articleHref, excerpt } from '@/lib/format';
import CategoryBadge from './CategoryBadge';
import ArticleMeta from './ArticleMeta';
import SmartImage from '@/components/shared/SmartImage';

export type CardVariant = 'featured' | 'default' | 'compact' | 'text';

const SIZES: Record<CardVariant, string> = {
  featured: '(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 780px',
  default: '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 380px',
  compact: '120px',
  text: '0px',
};

/**
 * The single article card used everywhere on the site.
 *
 * Variants
 *  - featured : lead story — 16/10 image, large headline, deck
 *  - default  : standard grid card — 16/9 image, headline, excerpt, meta
 *  - compact  : sidebar / side-list — 4/3 thumb beside a two-line headline
 *  - text     : headline-only list item (no image)
 *
 * Every variant shares the same 16/9-ish framing and typographic ramp so grids
 * stay aligned regardless of which section renders them.
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
  /** Override the heading tag — the front-page lead story is the page's <h1>. */
  headingLevel?: 'h1' | 'h2' | 'h3';
}) {
  const href = articleHref(article);
  const lede = excerpt(article, variant === 'featured' ? 220 : 130);
  // Each page must expose exactly one <h1>; grid cards default to <h3>.
  const H = headingLevel ?? (variant === 'featured' ? 'h2' : 'h3');

  /* ---------- text ---------- */
  if (variant === 'text') {
    return (
      <article className="group border-b border-border pb-3 last:border-0 last:pb-0">
        <h3 className="font-headline text-[15px] font-bold leading-snug text-ink">
          <Link href={href} className="line-clamp-2 group-hover:text-brand-blue">
            {article.title}
          </Link>
        </h3>
        <ArticleMeta article={article} showAuthor={false} className="mt-1.5" />
      </article>
    );
  }

  /* ---------- compact ---------- */
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="en-imgframe aspect-[4/3] w-24 shrink-0 sm:w-28"
        >
          <SmartImage
            src={article.featuredImage?.url}
            alt=""
            sizes={SIZES.compact}
            loading="lazy"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="font-headline text-[15px] font-bold leading-snug text-ink">
            <Link href={href} className="line-clamp-3 group-hover:text-brand-blue">
              {article.title}
            </Link>
          </h3>
          <ArticleMeta article={article} showAuthor={false} className="mt-1.5" />
        </div>
      </article>
    );
  }

  /* ---------- featured ---------- */
  if (variant === 'featured') {
    return (
      <article className="group">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="en-imgframe block aspect-[16/10] w-full">
          <SmartImage
            src={article.featuredImage?.url}
            alt=""
            sizes={SIZES.featured}
            priority={priority}
          />
        </Link>
        <div className="pt-4">
          <CategoryBadge category={article.category} size="md" />
          <H className="mt-2.5 font-headline text-2xl font-black leading-[1.15] tracking-tight text-ink sm:text-3xl">
            <Link href={href} className="line-clamp-3 hover:text-brand-blue">
              {article.title}
            </Link>
          </H>
          {showExcerpt && lede && (
            <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-muted">{lede}</p>
          )}
          <ArticleMeta
            article={article}
            showComments={showComments}
            showReadTime
            className="mt-3"
          />
        </div>
      </article>
    );
  }

  /* ---------- default ---------- */
  return (
    <article className="group">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="en-imgframe block aspect-[16/9] w-full">
        <SmartImage src={article.featuredImage?.url} alt="" sizes={SIZES.default} />
      </Link>
      <div className="pt-3">
        <CategoryBadge category={article.category} />
        <H className="mt-2 font-headline text-lg font-bold leading-snug tracking-tight text-ink">
          <Link href={href} className="line-clamp-3 hover:text-brand-blue">
            {article.title}
          </Link>
        </H>
        {showExcerpt && lede && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{lede}</p>
        )}
        <ArticleMeta article={article} showComments={showComments} className="mt-2.5" />
      </div>
    </article>
  );
}
