import Link from 'next/link';
import { Article } from '@/types';
import { COUNTIES } from '@/lib/constants';
import { articleHref } from '@/lib/format';

/**
 * "Inside This Issue" — the current edition's contents, county by county.
 * Preserved from the original front page, restyled as a compact dark band so
 * it reads as a contents page rather than a second hero.
 */
export default function InsideIssueStrip({
  articles,
  issue,
}: {
  articles: Article[];
  issue?: { title?: string; issueNumber?: number; month?: string; year?: number } | null;
}) {
  if (!articles?.length) return null;

  const items = COUNTIES.map((county) => {
    const top = articles.find((a) => a.category === county.name);
    return top ? { county, article: top } : null;
  }).filter(Boolean) as { county: (typeof COUNTIES)[number]; article: Article }[];

  if (!items.length) return null;

  return (
    <section
      aria-labelledby="inside-issue"
      className="border-y border-brand-blue-darker bg-brand-blue py-8 text-white md:py-10"
    >
      <div className="en-container">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/20 pb-3">
          <h2 id="inside-issue" className="font-headline text-xl font-black uppercase tracking-tight text-brand-gold">
            Inside This Issue
          </h2>
          {issue?.title && <p className="text-[11px] uppercase tracking-wider text-white/60">{issue.title}</p>}
        </div>

        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ county, article }) => (
            <li key={county.slug} className="border-b border-white/10">
              <Link
                href={articleHref(article)}
                className="group flex items-baseline gap-3 py-2.5"
              >
                <span className="en-kicker w-24 shrink-0 text-brand-gold">{county.name}</span>
                <span className="line-clamp-2 text-[13px] font-semibold text-white/85 transition-colors group-hover:text-brand-gold">
                  {article.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
