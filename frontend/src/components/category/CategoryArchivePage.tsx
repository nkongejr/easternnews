import { api } from '@/lib/api';
import { categoryColor } from '@/lib/format';
import NewsGrid from '@/components/articles/NewsGrid';
import ArticleCard from '@/components/articles/ArticleCard';
import Pagination from '@/components/shared/Pagination';
import PageHeader from '@/components/shared/PageHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import type { Crumb } from '@/components/shared/Breadcrumbs';

/**
 * Shared template for every category AND county page, so a section page and a
 * county page can never drift apart: page header → lead story → grid → pager,
 * with the same rail beside it.
 */
export default async function CategoryArchivePage({
  categoryName,
  baseHref,
  page,
  description,
  crumbs,
}: {
  categoryName: string;
  baseHref: string;
  page: number;
  description?: string;
  crumbs?: Crumb[];
}) {
  const result = await api.getArticles({ category: categoryName, page: String(page), limit: '9' });
  const accent = categoryColor(categoryName);
  const [lead, ...others] = result.data;
  const total = result.totalResults;

  return (
    <div>
      <PageHeader
        title={`${categoryName} News`}
        description={description ?? `${total} ${total === 1 ? 'article' : 'articles'}`}
        crumbs={
          crumbs ?? [{ label: 'Home', href: '/' }, { label: `${categoryName} News` }]
        }
        accent={accent}
      />

      <div className="en-container grid gap-10 py-8 md:py-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2">
          {result.data.length === 0 ? (
            <p className="border border-border bg-surface-alt p-8 text-center text-sm text-muted">
              No articles published yet in this {categoryName} section.
            </p>
          ) : (
            <>
              {/* Lead story, only on the first page */}
              {page === 1 && lead && (
                <div className="mb-8 border-b border-border pb-8">
                  <ArticleCard article={lead} variant="featured" showComments priority />
                </div>
              )}

              <NewsGrid
                articles={page === 1 ? others : result.data}
                columns={2}
                showComments
              />
            </>
          )}

          <Pagination currentPage={result.page} totalPages={result.totalPages} baseHref={baseHref} />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
