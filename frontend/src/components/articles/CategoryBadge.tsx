import Link from 'next/link';
import { CATEGORY_COLORS, DEFAULT_ACCENT, LIGHT_ACCENTS } from '@/lib/constants';
import { categoryRoute } from '@/lib/routes';

/**
 * Small solid category slug. Counties and sections link to their own page, so
 * every card doubles as a navigation surface.
 *
 * Set in the condensed face and squared off — a desk stamp rather than a pill.
 */
export default function CategoryBadge({
  category,
  size = 'sm',
  linked = true,
}: {
  category: string;
  size?: 'sm' | 'md';
  linked?: boolean;
}) {
  const color = CATEGORY_COLORS[category] || DEFAULT_ACCENT;
  const cls = `inline-block font-condensed font-bold uppercase leading-none tracking-[0.12em] ${
    size === 'md' ? 'px-2.5 py-[5px] text-[11px]' : 'px-2 py-1 text-[10px]'
  }`;

  // The yellow/cyan accents need ink rather than white text to stay legible (AA).
  const needsDarkText = LIGHT_ACCENTS.includes(color.toLowerCase());
  const style = needsDarkText
    ? { backgroundColor: color, color: 'var(--brand-navy)' }
    : { backgroundColor: color, color: '#ffffff' };

  const href = linked ? categoryRoute(category) : null;
  if (!href) {
    return (
      <span className={cls} style={style}>
        {category}
      </span>
    );
  }

  return (
    <Link href={href} className={`${cls} transition-opacity hover:opacity-85`} style={style}>
      {category}
    </Link>
  );
}
