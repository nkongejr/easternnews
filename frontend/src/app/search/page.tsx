import Link from 'next/link';
import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTIES } from '@/lib/constants';
import { BROWSE_SECTIONS, categoryRoute } from '@/lib/routes';
import NewsGrid from '@/components/articles/NewsGrid';
import SearchBar from '@/components/shared/SearchBar';
import PageHeader from '@/components/shared/PageHeader';

export const metadata = {
  alternates: { canonical: '/search' },
  title: 'Search',
  description: 'Search The Eastern Newspaper for stories, counties, sections and topics.',
};

type Props = { searchParams: Promise<{ q?: string }> };

const Chip = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="inline-flex items-center rounded-sm border border-border bg-white px-3 py-1.5 text-[13px] font-semibold text-text transition-colors hover:border-brand-primary hover:text-brand-primary"
  >
    {children}
  </Link>
);

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const hasQuery = term.length > 0;

  const [results, categories] = await Promise.all([
    hasQuery ? safe(api.getArticles({ search: term, limit: '24' }), EMPTY_PAGE) : Promise.resolve(EMPTY_PAGE),
    safe(api.getCategories(), []),
  ]);

  // Sections come from the CMS when available, so new desks appear here
  // automatically without a code change.
  const cmsSections = categories
    .filter((c) => c.type === 'section')
    .map((c) => ({
      name: c.name === 'National' ? 'Politics & Governance' : c.name,
      href: categoryRoute(c.name),
    }))
    .filter((s): s is { name: string; href: string } => Boolean(s.href));

  const allSections = cmsSections.length ? cmsSections : BROWSE_SECTIONS;

  const counties = COUNTIES.filter((c) => c.name.toLowerCase().includes(term.toLowerCase()));
  const sections = allSections.filter((s) => s.name.toLowerCase().includes(term.toLowerCase()));

  // Topics: distinct tags carried by the matching articles.
  const topics = [...new Set(results.data.flatMap((a) => a.tags || []))].slice(0, 12);

  return (
    <div>
      <PageHeader
        title="Search"
        description="Search every story published by The Eastern Newspaper."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
      />

      <div className="en-container py-8 md:py-10">
        <div className="mx-auto max-w-2xl">
          <SearchBar autoFocus />
        </div>

        {!hasQuery ? (
          /* Browse state — a publication index, not an empty box */
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <section aria-labelledby="browse-sections">
              <h2 id="browse-sections" className="mb-4 border-b-2 border-brand-secondary pb-2 font-headline text-lg font-black uppercase tracking-tight text-text">
                Sections
              </h2>
              <ul className="flex flex-wrap gap-2">
                {BROWSE_SECTIONS.map((s) => (
                  <li key={s.href}>
                    <Chip href={s.href}>{s.name}</Chip>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="browse-counties">
              <h2 id="browse-counties" className="mb-4 border-b-2 border-brand-secondary pb-2 font-headline text-lg font-black uppercase tracking-tight text-text">
                Counties
              </h2>
              <ul className="flex flex-wrap gap-2">
                {COUNTIES.map((c) => (
                  <li key={c.slug}>
                    <Chip href={`/counties/${c.slug}`}>{c.name}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div aria-live="polite">
            <p className="mb-6 border-b border-border pb-2 text-sm text-muted">
              <span className="font-bold text-text">{results.totalResults}</span>{' '}
              {results.totalResults === 1 ? 'result' : 'results'} for “{term}”
            </p>

            {/* Matching counties & sections surface above the story list */}
            {(counties.length > 0 || sections.length > 0) && (
              <section className="mb-8 grid gap-6 sm:grid-cols-2">
                {counties.length > 0 && (
                  <div>
                    <h2 className="en-kicker mb-3 text-muted">Counties</h2>
                    <ul className="flex flex-wrap gap-2">
                      {counties.map((c) => (
                        <li key={c.slug}>
                          <Chip href={`/counties/${c.slug}`}>{c.name}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {sections.length > 0 && (
                  <div>
                    <h2 className="en-kicker mb-3 text-muted">Sections</h2>
                    <ul className="flex flex-wrap gap-2">
                      {sections.map((s) => (
                        <li key={s.href}>
                          <Chip href={s.href}>{s.name}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {results.data.length > 0 ? (
              <>
                <NewsGrid articles={results.data} columns={3} showComments />

                {topics.length > 0 && (
                  <section className="mt-10" aria-labelledby="search-topics">
                    <h2 id="search-topics" className="en-kicker mb-3 text-muted">
                      Related topics
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <li key={t}>
                          <Chip href={`/search?q=${encodeURIComponent(t)}`}>{t}</Chip>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <div className="rounded-sm border border-border bg-surface-alt p-8 text-center">
                <p className="text-sm text-muted">
                  Nothing matched “{term}”. Try a county name, a shorter phrase, or browse
                  below.
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {allSections.slice(0, 5).map((s) => (
                    <li key={s.href}>
                      <Chip href={s.href}>{s.name}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
