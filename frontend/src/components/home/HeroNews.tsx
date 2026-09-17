import Link from 'next/link';
import { Article } from '@/types';
import CategoryBadge from '@/components/articles/CategoryBadge';
import ArticleMeta from '@/components/articles/ArticleMeta';
import SmartImage from '@/components/shared/SmartImage';
import { NewsList } from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import { articleHref, excerpt } from '@/lib/format';

/**
 * Front-page lead, laid out the way a newspaper front page is:
 * kicker → headline → standfirst → byline → photograph.
 *
 * Headline-first matters on the web as much as in print — it keeps the top
 * story's words above the fold instead of hiding them under a full-bleed
 * image. The photograph stays the largest element on the page, so the lead
 * still dominates the section.
 */
export default function HeroNews({
  lead,
  supporting,
}: {
  lead: Article;
  supporting: Article[];
}) {
  const href = articleHref(lead);
  const lede = excerpt(lead, 240);

  return (
    <section className="en-container py-6 md:py-8" aria-label="Top stories">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Lead story */}
        <article className="lg:col-span-2">
          <p className="mb-2.5 flex items-center gap-2 en-kicker text-brand-blue">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Cover Story
          </p>

          <CategoryBadge category={lead.category} size="md" />

          <h1 className="mt-2.5 font-headline text-[30px] font-black leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[40px]">
            <Link href={href} className="hover:text-brand-blue">
              {lead.title}
            </Link>
          </h1>

          {lede && (
            <p className="mt-3 max-w-[62ch] font-headline text-lg italic leading-relaxed text-muted md:text-xl">
              {lede}
            </p>
          )}

          <ArticleMeta article={lead} showReadTime showComments className="mt-3" />

          <Link
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            className="en-imgframe mt-4 block aspect-[16/9] w-full"
          >
            <SmartImage
              src={lead.featuredImage?.url}
              alt=""
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 780px"
              priority
            />
          </Link>

          {lead.featuredImage?.caption && (
            <p className="mt-2 border-b border-border pb-2 text-[11px] text-muted">
              {lead.featuredImage.caption}
              {lead.featuredImage.credit && (
                <span className="italic"> — {lead.featuredImage.credit}</span>
              )}
            </p>
          )}
        </article>

        {/* Supporting rail */}
        {supporting.length > 0 && (
          <div className="lg:border-l lg:border-border lg:pl-8">
            <SectionHeader title="Top Stories" accent="var(--color-brand-blue)" />
            <NewsList articles={supporting} variant="compact" />
          </div>
        )}
      </div>
    </section>
  );
}
