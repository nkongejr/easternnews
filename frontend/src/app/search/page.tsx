import { api } from '@/lib/api';
import ArticleCard from '@/components/articles/ArticleCard';
import SearchBar from '@/components/shared/SearchBar';

export const metadata = { title: 'Search' };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || '';
  const results = q ? await api.getArticles({ search: q, limit: '20' }) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-headline text-3xl font-bold mb-6">Search</h1>
      <SearchBar />
      {results && (
        <div className="mt-8">
          <p className="text-gray-500 mb-4">{results.totalResults} results for "{q}"</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {results.data.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}