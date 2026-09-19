import { api } from '@/lib/api';
import { categoryColor } from '@/lib/format';
import NewsGrid from '@/components/articles/NewsGrid';
import ArticleCard from '@/components/articles/ArticleCard';
import Pagination from '@/components/shared/Pagination';
import PageHeader from '@/components/shared/PageHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import type { Crumb } from '@/components/shared/Breadcrumbs';

/**
 * Generic story-listing template.
 *
 * Used by every category page, every county page and the Latest News
 * stream, so a section page and a county page can never drift apart:
 * page header → lead story → grid → pager, with the standard rail beside it.
 *
 * Pass `category` to filter; omit it for the whole newsroom.
 */
export default async function ArchivePage({
  title,
  description,
  crumbs,
  baseHref,
  page,
  category,
  accent,
  limit = 12,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  baseHref: string;
  page: number;
  category?: string;
  accent?: string;
  limit?: number;
}) {
  const params: Record<string, string> = { page: String(page), limit: String(limit) };
  if (category) params.category = category;

  const result = await api.getArticles(params);
  const total = result.totalResults;
  const [lead, ...others] = result.data;
  const rule = accent || (category ? categoryColor(category) : undefined);

  return (
    <div>
      <PageHeader
        title={title}
        description={
          description ?? `${total} ${total === 1 ? 'story' : 'stories'}`
        }
        crumbs={crumbs ?? [{ label: 'Home', href: '/' }, { label: title }]}
        accent={rule}
      />

      <div className="en-container grid gap-10 py-8 md:py-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2">
          {result.data.length === 0 ? (
            <p className="border border-border bg-surface-alt p-8 text-center text-sm text-muted">
              No stories published here yet. Check back shortly, or browse the{' '}
              <a href="/latest" className="font-semibold text-brand-primary hover:underline">
                latest news
              </a>
              .
            </p>
          ) : (
            <>
              {/* Lead story, first page only */}
              {page === 1 && lead && (
                <div className="mb-8 border-b border-border pb-8">
                  <ArticleCard article={lead} variant="featured" showComments priority />
                </div>
              )}

              <NewsGrid articles={page === 1 ? others : result.data} columns={2} showComments />
            </>
          )}

          <Pagination currentPage={result.page} totalPages={result.totalPages} baseHref={baseHref} />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
