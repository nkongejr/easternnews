import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="en-scrollbar-none flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold uppercase tracking-wider text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-brand-blue hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-ink' : ''}>
                  {item.label}
                </span>
              )}
              {!last && <FaChevronRight size={8} aria-hidden="true" className="text-border-strong" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
