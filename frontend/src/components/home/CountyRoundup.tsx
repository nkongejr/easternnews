import Link from 'next/link';
import { Article } from '@/types';
import SectionHeader from '@/components/shared/SectionHeader';
import ArticleMeta from '@/components/articles/ArticleMeta';
import { articleHref } from '@/lib/format';

export type CountyEntry = { county: { name: string; slug: string }; article: Article };

/**
 * "Around the Counties" — a dense, county-by-county index of the current
 * lead story from every desk. Gives the region parity on the front page
 * without forcing eleven full sections onto the reader.
 */
export default function CountyRoundup({ entries }: { entries: CountyEntry[] }) {
  if (!entries?.length) return null;

  return (
    <section aria-labelledby="county-roundup" className="bg-surface-alt py-10 md:py-12">
      <div className="en-container">
        <div id="county-roundup">
          <SectionHeader
            title="Around the Counties"
            href="/counties"
            kicker="County desk"
            accent="var(--color-brand-blue)"
            variant="bar"
          />
        </div>

        <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ county, article }) => (
            <li key={county.slug} className="border-t-2 border-brand-gold pt-3">
              <Link
                href={`/counties/${county.slug}`}
                className="en-kicker text-brand-blue hover:underline"
              >
                {county.name}
              </Link>
              <h3 className="mt-1.5 font-headline text-base font-bold leading-snug tracking-tight text-ink">
                <Link href={articleHref(article)} className="line-clamp-2 hover:text-brand-blue">
                  {article.title}
                </Link>
              </h3>
              <ArticleMeta article={article} showAuthor={false} className="mt-1.5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
