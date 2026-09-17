import { Article } from '@/types';
import ArticleCard from '@/components/articles/ArticleCard';
import { NewsList } from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import { categoryColor } from '@/lib/format';

/**
 * County desk block: one lead story from the county plus a supporting rail.
 * Used on the homepage for the counties with the heaviest coverage.
 */
export default function CountySection({
  county,
  articles,
}: {
  county: { name: string; slug: string };
  articles: Article[];
}) {
  if (!articles?.length) return null;

  const [lead, ...rest] = articles;

  return (
    <section aria-labelledby={`county-${county.slug}`} className="scroll-mt-20">
      <div id={`county-${county.slug}`}>
        <SectionHeader
          title={county.name}
          href={`/counties/${county.slug}`}
          accent={categoryColor(county.name)}
          kicker="County desk"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <ArticleCard article={lead} variant="featured" />
        {rest.length > 0 && <NewsList articles={rest.slice(0, 3)} variant="compact" />}
      </div>
    </section>
  );
}
