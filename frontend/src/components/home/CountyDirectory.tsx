import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { COUNTIES } from '@/lib/constants';
import SectionHeader from '@/components/shared/SectionHeader';

/**
 * County index. Rendered as an editorial A–Z style directory rather than a
 * wall of buttons — cheaper to scan and it matches the rest of the paper.
 */
export default function CountyDirectory({
  title = 'Explore All Counties',
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section aria-labelledby="county-directory">
      <div id="county-directory">
        <SectionHeader title={title} href="/counties" accent="var(--color-ink)" variant="bar" />
      </div>
      {description && <p className="mt-3 mb-5 text-sm text-muted">{description}</p>}

      <nav aria-label="Counties" className={description ? '' : 'mt-5'}>
        <ul className="grid grid-cols-2 gap-x-6 border-t border-border sm:grid-cols-3 lg:grid-cols-4">
          {COUNTIES.map((c) => (
            <li key={c.slug} className="border-b border-border">
              <Link
                href={`/counties/${c.slug}`}
                className="group flex items-center justify-between gap-2 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:text-brand-blue"
              >
                {c.name}
                <FaArrowRight
                  size={10}
                  aria-hidden="true"
                  className="shrink-0 text-border-strong transition-all group-hover:translate-x-0.5 group-hover:text-brand-gold"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
