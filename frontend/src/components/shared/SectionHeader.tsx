import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { categoryColor } from '@/lib/format';

function isLightColour(value: string) {
  const hex = value.trim().replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

/**
 * Section heading used by homepage blocks, archives and sidebars.
 *
 *  - `bar`   : solid Eastern-blue strip with white title (digital-news IA)
 *  - `rule`  : serif title sitting on a coloured underline (print-style)
 */
export default function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
  accent,
  kicker,
  variant = 'bar',
  className = '',
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  accent?: string;
  kicker?: string;
  variant?: 'bar' | 'rule';
  className?: string;
}) {
  const colour = accent || categoryColor(title);
  const lightBar = isLightColour(colour);

  if (variant === 'bar') {
    return (
      <div
        className={`en-section-bar ${className}`}
        style={{
          backgroundColor: lightBar ? 'var(--brand-primary)' : colour,
          borderLeft: `4px solid ${lightBar ? colour : 'var(--brand-secondary)'}`,
        }}
      >
        <div className="min-w-0">
          {kicker && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              {kicker}
            </p>
          )}
          <h2>{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-secondary transition-colors hover:text-white"
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

  return (
    <div
      className={`mb-5 flex items-end justify-between gap-4 border-b-2 pb-2 ${className}`}
      style={{ borderColor: colour }}
    >
      <div className="min-w-0">
        {kicker && <p className="en-kicker mb-1 text-muted">{kicker}</p>}
        <h2
          className="truncate font-headline text-xl font-black uppercase leading-none tracking-tight text-ink sm:text-2xl"
          style={{ color: colour }}
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
