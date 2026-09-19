import { Article } from '@/types';
import OverlayCard from '@/components/articles/OverlayCard';
import { NewsList } from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';

/**
 * Reusable category rail: coloured bar + one overlay lead + supporting list.
 * Used for Politics, Business, Sports and county desks on the homepage.
 */
export default function CategoryBlock({
  title,
  href,
  articles,
  accent,
  kicker,
}: {
  title: string;
  href: string;
  articles: Article[];
  accent?: string;
  kicker?: string;
}) {
  if (!articles?.length) return null;

  const [lead, ...rest] = articles;

  return (
    <section aria-labelledby={`block-${href.replace(/\//g, '')}`} className="scroll-mt-20">
      <div id={`block-${href.replace(/\//g, '')}`}>
        <SectionHeader
          title={title}
          href={href}
          accent={accent}
          kicker={kicker}
          variant="bar"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="min-h-[240px] sm:min-h-[280px]">
          <OverlayCard article={lead} size="md" headingLevel="h3" className="min-h-[240px] sm:min-h-[280px]" />
        </div>
        {rest.length > 0 && <NewsList articles={rest.slice(0, 4)} variant="compact" />}
      </div>
    </section>
  );
}
