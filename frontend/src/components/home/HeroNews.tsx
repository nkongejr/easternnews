import { Article } from '@/types';
import OverlayCard from '@/components/articles/OverlayCard';

/**
 * Featured mosaic: one dominant lead photograph with the headline overlaid,
 * plus three supporting overlay tiles — the Kenyanews-style top-of-page block.
 */
export default function HeroNews({
  lead,
  supporting,
}: {
  lead: Article;
  supporting: Article[];
}) {
  const extras = supporting.slice(0, 3);
  const hasExtras = extras.length > 0;

  return (
    <section className="en-container py-3 md:py-4" aria-label="Top stories">
      <div
        className={`grid grid-cols-1 gap-1 ${
          hasExtras ? 'lg:h-[520px] lg:grid-cols-5 lg:grid-rows-3' : ''
        }`}
      >
        <div
          className={`h-[240px] sm:h-[340px] lg:h-auto ${
            hasExtras ? 'lg:col-span-3 lg:row-span-3' : 'lg:h-[480px]'
          }`}
        >
          <OverlayCard
            article={lead}
            size="hero"
            priority
            headingLevel="h1"
            className="h-full min-h-0"
          />
        </div>

        {extras.map((article) => (
          <div key={article._id} className="h-[160px] sm:h-[180px] lg:col-span-2 lg:h-auto">
            <OverlayCard article={article} size="sm" className="h-full min-h-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
