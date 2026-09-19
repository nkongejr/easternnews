import Image from 'next/image';
import Link from 'next/link';
import { api, safe } from '@/lib/api';
import PageHeader from '@/components/shared/PageHeader';

export const metadata = {
  alternates: { canonical: '/archive' }, title: 'Back Issues' };

export default async function ArchivePage() {
  const issues = await safe(api.getIssues(), []);

  return (
    <div>
      <PageHeader
        title="Back Issues"
        description="Browse previous editions of The Eastern Newspaper."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Back Issues' }]}
      />

      <div className="en-container py-8 md:py-10">
        {issues.length === 0 ? (
          <p className="rounded-sm border border-border bg-surface-alt p-8 text-center text-sm text-muted">
            No back issues have been published yet.
          </p>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <li
                key={issue._id}
                className="group flex flex-col border border-border bg-white transition-colors hover:border-brand-blue"
              >
                <div className="en-imgframe aspect-[3/4] w-full bg-surface-sunken">
                  {issue.coverImage && (
                    <Image
                      src={issue.coverImage}
                      alt={issue.coverHeadline || issue.title}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 380px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="en-kicker text-brand-blue">
                    Issue {issue.issueNumber} · {issue.month} {issue.year}
                  </p>
                  <h2 className="mt-1.5 font-headline text-lg font-bold leading-snug text-ink">
                    {issue.title}
                  </h2>
                  {issue.coverHeadline && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                      {issue.coverHeadline}
                    </p>
                  )}
                  {issue.pdfUrl ? (
                    <a
                      href={issue.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-blue hover:underline"
                    >
                      Download PDF →
                    </a>
                  ) : (
                    <span className="mt-4 text-[11px] italic text-muted">
                      Digital replica coming soon
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
