import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTIES, FEATURED_COUNTIES, HOMEPAGE_SECTIONS } from '@/lib/constants';
import { Article } from '@/types';
import HeroNews from '@/components/home/HeroNews';
import BreakingNews from '@/components/home/BreakingNews';
import InsideIssueStrip from '@/components/home/InsideIssueStrip';
import CountyRail from '@/components/home/CountyRail';
import CountySection from '@/components/home/CountySection';
import CountyRoundup, { type CountyEntry } from '@/components/home/CountyRoundup';
import CountyDirectory from '@/components/home/CountyDirectory';
import OpinionSection from '@/components/home/OpinionSection';
import TopicChips from '@/components/home/TopicChips';
import NewsletterBand from '@/components/home/NewsletterBand';
import NewsGrid from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import AdBanner from '@/components/shared/AdBanner';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function HomePage() {
  const [heroRes, poolRes, meru, embu, tharakaNithi, kitui, issue] = await Promise.all([
    safe(api.getArticles({ hero: 'true', limit: '1' }), EMPTY_PAGE),
    // One wide request feeds the latest stream, the county roundup and the
    // category blocks — far cheaper than a request per block.
    safe(api.getArticles({ limit: '50' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Meru', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Embu', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Tharaka Nithi', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Kitui', limit: '4' }), EMPTY_PAGE),
    safe(api.getCurrentIssue(), null),
  ]);

  const pool = poolRes.data;
  const heroArticle = heroRes.data[0] || pool.find((a) => a.isHero) || pool[0];
  const rest = heroArticle ? pool.filter((a) => a._id !== heroArticle._id) : pool;

  // Group the pool once, then every block reads from it.
  const byCategory: Record<string, Article[]> = {};
  for (const a of pool) (byCategory[a.category] ||= []).push(a);

  // Category blocks render only if their desk has published stories, so the
  // front page is never hard-coded around today's example content.
  const sectionBlocks = HOMEPAGE_SECTIONS.map((s) => ({
    ...s,
    articles: (byCategory[s.category] || []).slice(0, 3),
  })).filter((s) => s.articles.length > 0);

  const opinion = [...(byCategory.Opinion || []), ...(byCategory.Editorial || [])].slice(0, 3);

  // Freshest story from every county desk.
  const roundup: CountyEntry[] = COUNTIES.map((county) => {
    const article = pool.find((a) => a.category === county.name);
    return article ? { county, article } : null;
  }).filter((e): e is CountyEntry => e !== null);

  const countySections = [
    { county: FEATURED_COUNTIES[0], articles: meru.data },
    { county: FEATURED_COUNTIES[1], articles: embu.data },
    { county: FEATURED_COUNTIES[2], articles: tharakaNithi.data },
    { county: FEATURED_COUNTIES[3], articles: kitui.data },
  ].filter((s) => s.articles.length > 0);

  if (!heroArticle) {
    return (
      <div className="en-container py-24 text-center">
        <h1 className="font-headline text-3xl font-black text-text">
          Welcome to The Eastern Newspaper
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Stories from across the Eastern region will appear here as soon as they are published.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BreakingNews articles={pool.slice(0, 8)} />

      <HeroNews lead={heroArticle} supporting={rest.slice(0, 4)} />

      {/* County navigation — the paper's signature beats */}
      <CountyRail />

      <AdBanner />

      {/* Main column + sticky rail */}
      <div className="en-container grid gap-10 py-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12 lg:col-span-2">
          <section aria-labelledby="latest-news">
            <div id="latest-news">
              <SectionHeader title="Latest News" href="/latest" linkLabel="All stories" />
            </div>
            {rest.length > 0 ? (
              <NewsGrid articles={rest.slice(0, 6)} columns={2} showComments />
            ) : (
              <p className="text-sm text-muted">No further stories published yet.</p>
            )}
          </section>

          {countySections.map((s) => (
            <CountySection key={s.county.slug} county={s.county} articles={s.articles} />
          ))}
        </div>

        <Sidebar />
      </div>

      <InsideIssueStrip articles={issue?.articles || []} issue={issue} />

      {roundup.length > 0 && <CountyRoundup entries={roundup} />}

      {/* Category blocks */}
      {sectionBlocks.map((s, i) => (
        <section
          key={s.name}
          aria-labelledby={`home-${s.href.replace(/\//g, '')}`}
          className={`py-10 md:py-12 ${i % 2 === 1 ? 'border-y border-border bg-surface-alt' : ''}`}
        >
          <div className="en-container">
            <div id={`home-${s.href.replace(/\//g, '')}`}>
              <SectionHeader title={s.name} href={s.href} kicker={s.kicker} />
            </div>
            <TopicChips topics={s.topics} />
            <NewsGrid articles={s.articles} columns={3} showComments />
          </div>
        </section>
      ))}

      <OpinionSection articles={opinion} />

      <NewsletterBand />

      <section className="en-container py-10 md:py-12">
        <CountyDirectory description="Every county desk, from Meru to Marsabit." />
      </section>
    </div>
  );
}
