import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTIES, FEATURED_COUNTIES, HOMEPAGE_SECTIONS } from '@/lib/constants';
import { Article } from '@/types';
import HeroNews from '@/components/home/HeroNews';
import BreakingNews from '@/components/home/BreakingNews';
import InsideIssueStrip from '@/components/home/InsideIssueStrip';
import CountyRail from '@/components/home/CountyRail';
import CategoryBlock from '@/components/home/CategoryBlock';
import CountyRoundup, { type CountyEntry } from '@/components/home/CountyRoundup';
import CountyDirectory from '@/components/home/CountyDirectory';
import OpinionSection from '@/components/home/OpinionSection';
import NewsletterBand from '@/components/home/NewsletterBand';
import NewsGrid from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import AdBanner from '@/components/shared/AdBanner';
import Sidebar from '@/components/sidebar/Sidebar';
import { categoryColor } from '@/lib/format';

function take(source: Article[], n: number, used: Set<string>): Article[] {
  const out: Article[] = [];
  for (const a of source) {
    if (out.length >= n) break;
    if (used.has(a._id)) continue;
    used.add(a._id);
    out.push(a);
  }
  return out;
}

export default async function HomePage() {
  const [heroRes, poolRes, meru, embu, tharakaNithi, kitui, issue] = await Promise.all([
    safe(api.getArticles({ hero: 'true', limit: '1' }), EMPTY_PAGE),
    safe(api.getArticles({ limit: '50' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Meru', limit: '5' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Embu', limit: '5' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Tharaka Nithi', limit: '5' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Kitui', limit: '5' }), EMPTY_PAGE),
    safe(api.getCurrentIssue(), null),
  ]);

  const pool = poolRes.data;
  const heroArticle = heroRes.data[0] || pool.find((a) => a.isHero) || pool[0];

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

  const used = new Set<string>([heroArticle._id]);
  const rest = pool.filter((a) => a._id !== heroArticle._id);

  const featured = rest.filter((a) => a.isFeatured);
  const supporting = take(featured.length >= 3 ? featured : rest, 3, used);

  const breakingStories = pool.filter((a) => a.isBreaking);
  const ticker = breakingStories.length ? breakingStories.slice(0, 8) : pool.slice(0, 8);

  const byCategory: Record<string, Article[]> = {};
  for (const a of pool) (byCategory[a.category] ||= []).push(a);

  const latest = take(rest, 6, used);

  const sectionBlocks = HOMEPAGE_SECTIONS.map((s) => ({
    ...s,
    articles: take(byCategory[s.category] || [], 5, used),
  })).filter((s) => s.articles.length > 0);

  const opinion = take(
    [...(byCategory.Opinion || []), ...(byCategory.Editorial || [])],
    3,
    used,
  );

  const countyFetches: Record<string, Article[]> = {
    Meru: meru.data,
    Embu: embu.data,
    'Tharaka Nithi': tharakaNithi.data,
    Kitui: kitui.data,
  };

  const countySections = FEATURED_COUNTIES.map((county) => ({
    county,
    articles: take(countyFetches[county.name] || byCategory[county.name] || [], 5, new Set()),
  })).filter((s) => s.articles.length > 0);

  const roundup: CountyEntry[] = COUNTIES.map((county) => {
    const article = pool.find((a) => a.category === county.name);
    return article ? { county, article } : null;
  }).filter((e): e is CountyEntry => e !== null);

  return (
    <div>
      <BreakingNews articles={ticker} breaking={breakingStories.length > 0} />

      <HeroNews lead={heroArticle} supporting={supporting} />

      <CountyRail />

      <AdBanner />

      <div className="en-container grid gap-10 py-8 md:py-10 lg:grid-cols-3 lg:gap-10">
        <div className="flex min-w-0 flex-col gap-10 lg:col-span-2">
          <section aria-labelledby="latest-news">
            <div id="latest-news">
              <SectionHeader title="Latest News" href="/latest" linkLabel="All stories" />
            </div>
            {latest.length > 0 ? (
              <div className="mt-5">
                <NewsGrid articles={latest} columns={2} showComments />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">No further stories published yet.</p>
            )}
          </section>

          {sectionBlocks.map((s) => (
            <CategoryBlock
              key={s.name}
              title={s.name}
              href={s.href}
              articles={s.articles}
              kicker={s.kicker}
              accent={categoryColor(s.category)}
            />
          ))}

          {countySections.map((s) => (
            <CategoryBlock
              key={s.county.slug}
              title={s.county.name}
              href={`/counties/${s.county.slug}`}
              articles={s.articles}
              kicker="County desk"
              accent={categoryColor(s.county.name)}
            />
          ))}
        </div>

        <Sidebar />
      </div>

      <InsideIssueStrip articles={issue?.articles || []} issue={issue} />

      {roundup.length > 0 && <CountyRoundup entries={roundup} />}

      <OpinionSection articles={opinion} />

      <NewsletterBand />

      <section className="en-container py-10 md:py-12">
        <CountyDirectory description="Every county desk, from Meru to Marsabit." />
      </section>
    </div>
  );
}
