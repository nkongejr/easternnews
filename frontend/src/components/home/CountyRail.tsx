import Link from 'next/link';
import { COUNTIES } from '@/lib/constants';

/**
 * Horizontal county navigation rail.
 *
 * County journalism is the paper's signature, so the desks get their own
 * always-available rail. It scrolls horizontally on phones (never causing
 * page overflow) and highlights the county you are currently reading.
 */
export default function CountyRail({
  active,
  label = 'Counties',
}: {
  active?: string;
  label?: string;
}) {
  return (
    <nav aria-label="County desks" className="border-y border-border bg-white">
      <div className="en-container flex items-center gap-3">
        <p className="en-kicker hidden shrink-0 text-muted lg:block">{label}</p>
        <ul className="en-scrollbar-none flex min-w-0 flex-1 gap-1 overflow-x-auto py-2">
          {COUNTIES.map((c) => {
            const isActive = active === c.slug;
            return (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/counties/${c.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-block whitespace-nowrap rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-ink hover:bg-surface-alt hover:text-brand-primary'
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
