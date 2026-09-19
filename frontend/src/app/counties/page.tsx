import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTY_NAMES } from '@/lib/constants';
import CountyDirectory from '@/components/home/CountyDirectory';
import CountyRail from '@/components/home/CountyRail';
import PageHeader from '@/components/shared/PageHeader';
import NewsGrid from '@/components/articles/NewsGrid';
import Sidebar from '@/components/sidebar/Sidebar';
import ArticleCard from '@/components/articles/ArticleCard';

export const metadata = {
  alternates: { canonical: '/counties' },
  title: 'County News',
  description:
    'News from Meru, Embu, Tharaka Nithi, Isiolo, Samburu, Kirinyaga, Laikipia, Kitui, Machakos, Makueni and Marsabit.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function CountiesIndexPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNum = Number(page || 1);

  const result = await safe(api.getArticles({ limit: '50', page: String(pageNum) }), EMPTY_PAGE);
  const countyStories = result.data.filter((a) => COUNTY_NAMES.includes(a.category));
  const [lead, ...others] = countyStories;

  return (
    <div>
      <PageHeader
        title="County News"
        description="Reporting from every Eastern Newspaper county desk."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'County News' }]}
      />
      <CountyRail />

      <div className="en-container grid gap-10 py-8 md:py-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2">
          {countyStories.length === 0 ? (
            <p className="border border-border bg-surface-alt p-8 text-center text-sm text-muted">
              No county stories published yet.
            </p>
          ) : (
            <>
              {pageNum === 1 && lead && (
                <div className="mb-8 border-b border-border pb-8">
                  <ArticleCard article={lead} variant="featured" showComments priority />
                </div>
              )}
              <NewsGrid articles={pageNum === 1 ? others : countyStories} columns={2} showComments />
            </>
          )}

          <div className="mt-12">
            <CountyDirectory title="All county desks" />
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
