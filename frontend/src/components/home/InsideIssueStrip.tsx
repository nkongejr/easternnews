import Link from 'next/link';
import { Article } from '@/types';
import { COUNTIES } from '@/lib/constants';

export default function InsideIssueStrip({ articles }: { articles: Article[] }) {
  const items = COUNTIES.map((county) => {
    const top = articles.find((a) => a.category === county.name);
    return top ? { county, article: top } : null;
  }).filter(Boolean) as { county: typeof COUNTIES[0]; article: Article }[];

  if (!items.length) return null;

  return (
    <section className="bg-brand-blue text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="font-headline font-bold text-brand-gold uppercase text-sm mb-3">
          Inside This Issue
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map(({ county, article }) => (
            <Link
              key={county.slug}
              href={`/articles/${article.slug}`}
              className="block bg-white/10 hover:bg-white/20 rounded p-3 transition"
            >
              <span className="text-brand-gold text-xs font-bold uppercase">{county.name}</span>
              <p className="text-sm font-semibold line-clamp-2 mt-1">{article.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}