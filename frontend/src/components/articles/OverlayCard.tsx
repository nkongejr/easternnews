import Link from 'next/link';
import { Article } from '@/types';
import CategoryBadge from './CategoryBadge';
import SmartImage from '@/components/shared/SmartImage';
import { articleHref, formatDate } from '@/lib/format';

type OverlaySize = 'hero' | 'md' | 'sm';

/**
 * Image-first story tile with a dark gradient and the headline sitting on
 * the photograph — the signature digital-news mosaic used on the homepage
 * hero and inside category blocks.
 */
export default function OverlayCard({
  article,
  size = 'md',
  priority = false,
  headingLevel,
  className = '',
}: {
  article: Article;
  size?: OverlaySize;
  priority?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  const href = articleHref(article);
  const H = headingLevel ?? (size === 'hero' ? 'h1' : 'h3');
  const titleCls =
    size === 'hero'
      ? 'text-xl sm:text-2xl md:text-[32px] leading-[1.15]'
      : size === 'md'
        ? 'text-lg sm:text-xl leading-snug'
        : 'text-[15px] sm:text-base leading-snug';
  const pad = size === 'hero' ? 'p-4 sm:p-6 md:p-7' : size === 'md' ? 'p-3.5 sm:p-4' : 'p-3';
  const date = formatDate(article.publishDate || article.createdAt);

  return (
    <article className={`group relative h-full min-h-[160px] overflow-hidden bg-brand-primary-darker ${className}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 block"
      >
        <SmartImage
          src={article.featuredImage?.url}
          alt=""
          sizes={
            size === 'hero'
              ? '(max-width: 1023px) 100vw, 65vw'
              : '(max-width: 1023px) 100vw, 40vw'
          }
          priority={priority}
        />
      </Link>

      <div className="en-overlay-grad pointer-events-none absolute inset-0" />

      <div className={`absolute inset-x-0 bottom-0 z-10 ${pad}`}>
        <CategoryBadge category={article.category} size={size === 'sm' ? 'sm' : 'md'} />
        <H className={`mt-2 font-headline font-black tracking-tight text-white ${titleCls}`}>
          <Link
            href={href}
            className={`line-clamp-3 transition-colors hover:text-brand-secondary ${
              size === 'sm' ? 'line-clamp-2' : ''
            }`}
          >
            {article.title}
          </Link>
        </H>
        {date && (
          <time
            dateTime={article.publishDate || article.createdAt}
            className="mt-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          >
            {date}
          </time>
        )}
      </div>
    </article>
  );
}
