import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { SITE, TILL_NUMBER } from '@/lib/constants';

export const metadata = { title: 'Advertise With Us' };

export default function AdvertisePage() {
  return (
    <div>
      <PageHeader
        title="Advertise With Us"
        description="Reach readers across the Eastern region every month."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Advertise' }]}
      />

      <div className="en-container py-8 md:py-10">
        <article className="prose-page mx-auto max-w-3xl">
          <p>
            Reach thousands of readers across the Eastern region every month. We offer sidebar
            ads, banner placements and sponsored content packages tailored to hotels, colleges,
            universities and service businesses.
          </p>

          <ul className="my-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Sidebar', body: 'Always-on display ads beside every story.' },
              { title: 'Banner', body: 'Full-width leaderboard across the front page.' },
              { title: 'Sponsored', body: 'Editorially labelled sponsored features.' },
            ].map((p) => (
              <li key={p.title} className="border-t-2 border-brand-gold bg-surface-alt p-4">
                <p className="font-headline text-base font-bold text-ink">{p.title}</p>
                <p className="mt-1 text-sm">{p.body}</p>
              </li>
            ))}
          </ul>

          <h2 className="mb-3 font-headline text-2xl font-bold text-ink">Get in touch</h2>
          <p>
            Contact us at{' '}
            <a href={`mailto:${SITE.email}`} className="text-brand-blue underline">
              {SITE.email}
            </a>{' '}
            or call {SITE.phoneLabel} to discuss rates.
          </p>
          <p>
            Prefer to pay by M-PESA? Buy Goods Till Number{' '}
            <span className="font-bold text-ink">{TILL_NUMBER}</span>.
          </p>
          <p>
            You can also browse the businesses already supporting us in the{' '}
            <Link href="/advertisers" className="text-brand-blue underline">
              advertiser directory
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
