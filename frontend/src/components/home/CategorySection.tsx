import Link from 'next/link';
import { Article } from '@/types';
import ArticleCard from '../articles/ArticleCard';

export default function CategorySection({
  title,
  href,
  articles,
}: {
  title: string;
  href: string;
  articles: Article[];
}) {
  if (!articles?.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 border-b-2 border-brand-blue pb-2">
        <h2 className="font-headline text-2xl font-bold text-brand-blue">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-brand-blue hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </section>
  );
}