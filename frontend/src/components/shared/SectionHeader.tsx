import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { BRAND, WHITE } from '@/lib/constants';
import { categoryColor, contrastRatio, isPaleFill, readableInk, resolveColour } from '@/lib/format';

/**
 * Section heading used by homepage blocks, archives and sidebars.
 *
 *  - `bar`   : solid desk-coloured strip, title set in the ink that
 *              actually reads on that colour (navy on the bright desks,
 *              white on the navy ones). Desks in the pale half of the
 *              palette — lime, cyan, pale, ice — invert to a navy bar
 *              carrying the desk colour as its edge, so every bar keeps
 *              its colour without going washed out.
 *  - `rule`  : serif title on a coloured underline (print-style).
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
  // `accent` may arrive as a hex or as a token reference, so resolve it
  // before measuring anything.
  const colour = resolveColour(accent || categoryColor(title));

  if (variant === 'bar') {
    const pale = isPaleFill(colour);
    const background = pale ? BRAND.primary : colour;
    const ink = readableInk(background);
    // The edge always contrasts with the bar: lime against a navy bar,
    // navy ink against a bright one.
    const edge = pale ? colour : ink === WHITE ? BRAND.secondary : ink;

    return (
      <div
        className={`en-section-bar ${className}`}
        style={{ backgroundColor: background, borderLeft: `4px solid ${edge}`, color: ink }}
      >
        <div className="min-w-0">
          {kicker && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ opacity: 0.72 }}>
              {kicker}
            </p>
          )}
          <h2>{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-opacity hover:opacity-75"
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

  // On white, a title only keeps its desk colour if that colour passes AA
  // as body text; the pale desks would otherwise vanish into the page.
  const titleColour = contrastRatio(colour, WHITE) >= 4.5 ? colour : BRAND.navy;

  return (
    <div
      className={`mb-5 flex items-end justify-between gap-4 border-b-2 pb-2 ${className}`}
      style={{ borderColor: isPaleFill(colour) ? 'var(--border-strong)' : colour }}
    >
      <div className="min-w-0">
        {kicker && <p className="en-kicker mb-1 text-muted">{kicker}</p>}
        <h2
          className="truncate font-headline text-xl font-black uppercase leading-none tracking-tight sm:text-2xl"
          style={{ color: titleColour }}
        >
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-brand-accent-deep"
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
