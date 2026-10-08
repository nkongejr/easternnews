import Link from 'next/link';
import { CATEGORY_COLORS, DEFAULT_ACCENT, LIGHT_BADGE_COLORS, BRAND } from '@/lib/constants';
import { categoryRoute } from '@/lib/routes';

/**
 * Small solid category slug. Counties and sections link to their own page, so
 * every card doubles as a navigation surface.
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
  const cls = `inline-block rounded-sm font-bold uppercase tracking-wider ${
    size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]'
  }`;

  // Light fills from the logo palette (e.g. Kitui's lime) need dark ink
  // to stay legible (AA contrast); every other badge uses white.
  const needsDarkText = LIGHT_BADGE_COLORS.includes(color.toLowerCase());
  const style = needsDarkText
    ? { backgroundColor: color, color: BRAND.primaryDarker }
    : { backgroundColor: color };

  const href = linked ? categoryRoute(category) : null;
  if (!href) {
    return (
      <span className={cls} style={style}>
        {category}
      </span>
    );
  }

  return (
    <Link href={href} className={`${cls} hover:opacity-85`} style={style}>
      {category}
    </Link>
  );
}
