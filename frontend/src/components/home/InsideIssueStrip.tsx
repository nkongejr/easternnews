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
    <section className="bg-brand-blue-dark text-white border-y-4 border-brand-gold" aria-label="Inside this issue">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <h2 className="font-headline font-bold text-brand-gold uppercase text-sm tracking-[0.18em] mb-4 flex items-center gap-3">
          Inside This Issue
          <span className="flex-1 h-px bg-white/20" aria-hidden="true" />
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
          {items.map(({ county, article }, i) => (
            <Link
              key={county.slug}
              href={`/articles/${article.slug}`}
              className={`block py-2 pr-4 hover:text-brand-gold transition-colors ${
                i % 4 !== 0 ? 'lg:border-l lg:border-white/15 lg:pl-4' : ''
              }`}
            >
              <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.14em]">
                {county.name}
              </span>
              <p className="text-sm font-semibold line-clamp-2 mt-1 leading-snug">
                {article.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
