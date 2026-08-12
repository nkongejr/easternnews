import { api } from '@/lib/api';
import ArticleCard from '@/components/articles/ArticleCard';
import Pagination from '@/components/shared/Pagination';
import Sidebar from '@/components/sidebar/Sidebar';
import { CATEGORY_COLORS } from '@/lib/constants';

export default async function CategoryArchivePage({
  categoryName,
  baseHref,
  page,
}: {
  categoryName: string;
  baseHref: string;
  page: number;
}) {
  const result = await api.getArticles({ category: categoryName, page: String(page), limit: '9' });
  const color = CATEGORY_COLORS[categoryName] || '#1a4d8f';

  return (
    <div>
      <div className="py-10 text-white" style={{ backgroundColor: color }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-headline text-3xl md:text-4xl font-black">{categoryName} News</h1>
          <p className="text-white/80 mt-2">{result.totalResults} articles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {result.data.length === 0 ? (
            <p className="text-gray-500">No articles published yet in this category.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {result.data.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          )}
          <Pagination currentPage={result.page} totalPages={result.totalPages} baseHref={baseHref} />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}