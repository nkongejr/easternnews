import { Article } from '@/types';
import ArticleCard from './ArticleCard';

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles?.length) return null;
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="font-headline text-2xl font-bold mb-4">Related Articles</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </section>
  );
}