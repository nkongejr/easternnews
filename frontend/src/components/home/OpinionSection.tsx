import Link from 'next/link';
import { Article } from '@/types';
import SectionHeader from '@/components/shared/SectionHeader';
import SmartImage from '@/components/shared/SmartImage';
import { articleHref, byline, excerpt, formatDate } from '@/lib/format';

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Opinion & analysis gets its own treatment: tinted band, no photography, and
 * a writer mugshot (or initials) leading each item — the visual cue readers
 * use to tell comment from reporting.
 */
export default function OpinionSection({
  articles,
  title = 'Opinion & Analysis',
  href = '/opinion',
  kicker = 'Comment',
}: {
  articles: Article[];
  title?: string;
  href?: string;
  kicker?: string;
}) {
  if (!articles?.length) return null;

  return (
    <section aria-labelledby="opinion-section" className="bg-surface-alt py-10 md:py-12">
      <div className="en-container">
        <div id="opinion-section">
          <SectionHeader title={title} href={href} kicker={kicker} accent="var(--color-ink)" />
        </div>

        <ul className="grid gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const author = byline(a);
            return (
              <li key={a._id} className="group flex gap-4">
                <div
                  className="en-imgframe mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border-strong"
                  aria-hidden="true"
                >
                  {a.author?.photo ? (
                    <SmartImage
                      src={a.author.photo}
                      alt=""
                      sizes="48px"
                      imgClassName="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-brand-blue font-headline text-sm font-bold text-brand-gold">
                      {initials(author)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="en-kicker text-brand-blue">{author}</p>
                  <h3 className="mt-1 font-headline text-lg font-bold leading-snug tracking-tight text-ink">
                    <Link href={articleHref(a)} className="line-clamp-3 hover:text-brand-blue">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 line-clamp-3 font-headline text-[15px] italic leading-relaxed text-muted">
                    {excerpt(a, 160)}
                  </p>
                  {a.publishDate && (
                    <time dateTime={a.publishDate} className="mt-2 block text-[11px] text-muted">
                      {formatDate(a.publishDate)}
                    </time>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
