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
    <section className="mb-10" aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Newspaper section header: heavy rule + label + view-all */}
      <div className="section-rule flex items-end justify-between pb-2 mb-5">
        <h2 id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="h-section">
          {title}
        </h2>
        <Link href={href} className="text-[11px] font-bold uppercase tracking-widest text-brand-blue hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </section>
  );
}
