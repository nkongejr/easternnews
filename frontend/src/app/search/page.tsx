import { api, safe, EMPTY_PAGE } from '@/lib/api';
import NewsGrid from '@/components/articles/NewsGrid';
import SearchBar from '@/components/shared/SearchBar';
import PageHeader from '@/components/shared/PageHeader';

export const metadata = { title: 'Search' };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const results = q ? await safe(api.getArticles({ search: q, limit: '20' }), EMPTY_PAGE) : null;

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

        {results && (
          <section className="mt-10" aria-live="polite">
            <p className="mb-6 border-b border-border pb-2 text-sm text-muted">
              <span className="font-bold text-ink">{results.totalResults}</span>{' '}
              {results.totalResults === 1 ? 'result' : 'results'} for “{q}”
            </p>

            {results.data.length > 0 ? (
              <NewsGrid articles={results.data} columns={3} showComments />
            ) : (
              <p className="rounded-sm border border-border bg-surface-alt p-8 text-center text-sm text-muted">
                Nothing matched “{q}”. Try a county name, or a shorter phrase.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
