import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { categoryColor } from '@/lib/format';

/**
 * Newspaper section rule: bold serif title on a thick coloured bottom border,
 * with a right-aligned "View all" jump-off. Used by every homepage block and
 * every category page so headings are identical everywhere.
 */
export default function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
  accent,
  kicker,
  className = '',
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  /** CSS colour for the rule — defaults to the category's mapped accent. */
  accent?: string;
  kicker?: string;
  className?: string;
}) {
  const rule = accent || categoryColor(title);

  return (
    <div
      className={`mb-5 flex items-end justify-between gap-4 border-b-2 pb-2 ${className}`}
      style={{ borderColor: rule }}
    >
      <div className="min-w-0">
        {kicker && <p className="en-kicker mb-1 text-muted">{kicker}</p>}
        <h2
          className="truncate font-headline text-xl font-black uppercase leading-none tracking-tight text-ink sm:text-2xl"
          style={{ color: rule }}
        >
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-brand-blue"
        >
          {linkLabel}
          <FaArrowRight
            size={10}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
