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
 *  - `bar`   : the desk's own ink reversed out in white condensed capitals,
 *              with the logo yellow bookending the block (digital-news IA)
 *  - `rule`  : black display title sitting on the desk's coloured rule
 *              (print-style)
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
          borderLeftColor: lightBar ? colour : 'var(--brand-secondary)',
        }}
      >
        <div className="min-w-0">
          {kicker && (
            <p className="mb-0.5 font-condensed text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-brand-cyan">
              {kicker}
            </p>
          )}
          <h2>{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1.5 font-condensed text-[11px] font-bold uppercase tracking-[0.12em] text-brand-secondary transition-colors hover:text-white"
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
    <div className={`mb-5 ${className}`}>
      <div className="flex items-end justify-between gap-4 pb-2">
        <div className="min-w-0">
          {kicker && (
            <p className="en-kicker mb-1.5" style={{ color: colour }}>
              {kicker}
            </p>
          )}
          <h2 className="truncate font-headline text-2xl font-black leading-none tracking-[-0.02em] text-headline sm:text-3xl">
            {title}
          </h2>
        </div>

        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1.5 pb-1 font-condensed text-[11px] font-bold uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand-primary"
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

      {/* Desk rule: the accent colour, closed by a hairline. */}
      <div className="border-b border-border">
        <div className="h-[3px]" style={{ backgroundColor: colour }} />
      </div>
    </div>
  );
}
