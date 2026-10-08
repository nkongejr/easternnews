import Link from 'next/link';
import { api, safe } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { SITE } from '@/lib/constants';
import PageHeader from '@/components/shared/PageHeader';
import SmartImage from '@/components/shared/SmartImage';
import { Issue } from '@/types';

export const metadata = {
  alternates: { canonical: '/publications' },
  title: 'Publications',
  description:
    'Every print edition of The Eastern Newspaper — browse the covers and download the PDF of each issue.',
  openGraph: {
    title: 'Publications',
    description:
      'Every print edition of The Eastern Newspaper — browse the covers and download the PDF of each issue.',
    url: `${SITE.url}/publications`,
    type: 'website',
  },
};

/**
 * Publications library — the print archive, newest edition first.
 * Built entirely from /api/issues, so a new edition appears here as soon as
 * it is published from the admin dashboard. Editions without a PDF link show
 * the "PDF not available yet" note instead of a dead download button.
 */
export default async function PublicationsPage() {
  const issues = await safe(api.getIssues(), []);
  const editions = [...issues].sort((a, b) => b.issueNumber - a.issueNumber);
  const currentIssue = editions.find((issue) => issue.isCurrent);

  return (
    <div>
      <PageHeader
        title="Publications"
        description="Every edition of The Eastern Newspaper, newest first. Open a cover to download the print PDF."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Publications' }]}
      />

      <div className="en-container py-8 md:py-10">
        {editions.length === 0 ? (
          <p className="border border-border-strong bg-surface-alt p-8 text-center text-sm text-muted">
            No publications have been published yet.
          </p>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <h2 className="font-headline text-2xl font-black uppercase tracking-[-0.01em] text-headline">
                All editions
              </h2>
              <p className="font-condensed text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                {editions.length} {editions.length === 1 ? 'edition' : 'editions'}
                {currentIssue ? ` · Current: Issue ${currentIssue.issueNumber}` : ''}
              </p>
            </div>

            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {editions.map((issue) => (
                <li key={issue._id}>
                  <IssueCard issue={issue} />
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 text-center text-sm text-muted">
          Looking for a single story?{' '}
          <Link href="/search" className="font-semibold text-brand-blue hover:underline">
            Search the archive
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const added = formatDate(issue.createdAt, 'd MMMM yyyy');
  const coverAlt = `Cover of ${issue.title}`;

  return (
    <article
      className={`group flex h-full flex-col border bg-white transition-colors ${
        issue.isCurrent
          ? 'border-brand-cyan-dark shadow-md'
          : 'border-border-strong hover:border-brand-primary'
      }`}
    >
      <div className="en-imgframe relative aspect-[3/4] w-full bg-surface-sunken">
        <SmartImage
          src={issue.coverImage}
          alt={coverAlt}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 380px"
        />
        {issue.isCurrent && (
          <span className="absolute left-0 top-3 bg-brand-secondary px-2.5 py-1.5 font-condensed text-[10px] font-black uppercase tracking-[0.14em] text-brand-navy">
            Current issue
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="en-kicker text-brand-primary">
          Issue {issue.issueNumber} · {issue.month} {issue.year}
        </p>
        <h3 className="mt-1.5 font-headline text-[19px] font-bold leading-snug tracking-[-0.015em] text-headline">
          {issue.title}
        </h3>

        {issue.coverHeadline && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
            {issue.coverHeadline}
          </p>
        )}

        {added && (
          <p className="mt-3 font-condensed text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
            Added {added}
          </p>
        )}

        <div className="mt-4 border-t border-border pt-4">
          {issue.pdfUrl ? (
            <a
              href={issue.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download Issue ${issue.issueNumber} PDF (opens in a new tab)`}
              className="en-btn inline-flex w-full items-center justify-center gap-2 bg-brand-secondary px-4 py-3 text-[12px] text-brand-navy transition-colors hover:bg-brand-secondary-dark"
            >
              Download PDF
              <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <p className="text-[11px] font-semibold italic text-muted">
              PDF not available yet
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
