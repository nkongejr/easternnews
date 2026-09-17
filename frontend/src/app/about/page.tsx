import PageHeader from '@/components/shared/PageHeader';
import { COUNTIES, SITE } from '@/lib/constants';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Us"
        description={SITE.tagline}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      <div className="en-container py-8 md:py-10">
        <article className="prose-page mx-auto max-w-3xl">
          <p>
            The Eastern Newspaper is a regional monthly publication covering{' '}
            {COUNTIES.map((c) => c.name).join(', ')} counties. Published by The Mashariki
            Newspaper Ltd, our mission is to keep residents of the Eastern region informed on
            governance, development, business, sports and community affairs — “Be in the Know.”
          </p>
          <p>
            Every edition is built around our county desks. Each desk is responsible for the
            stories that matter where you live: county budgets and pending bills, roads, water,
            health, education, security and the local economy.
          </p>
          <h2 className="mb-3 mt-8 font-headline text-2xl font-bold text-ink">Where we work</h2>
          <ul className="mb-6 grid grid-cols-2 gap-x-6 border-t border-border sm:grid-cols-3">
            {COUNTIES.map((c) => (
              <li key={c.slug} className="border-b border-border py-2 text-[15px] font-semibold">
                <a href={`/counties/${c.slug}`} className="hover:text-brand-blue hover:underline">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mb-3 mt-8 font-headline text-2xl font-bold text-ink">Contact</h2>
          <p>
            {SITE.address}, {SITE.postal}.
            <br />
            Tel {SITE.phoneLabel} · {SITE.email}
          </p>
        </article>
      </div>
    </div>
  );
}
