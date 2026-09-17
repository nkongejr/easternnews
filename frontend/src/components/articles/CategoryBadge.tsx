import Link from 'next/link';
import { CATEGORY_COLORS, DEFAULT_ACCENT, COUNTIES } from '@/lib/constants';

/** Categories that own a real section page. */
const SECTION_ROUTES: Record<string, string> = {
  Business: '/business',
  Sports: '/sports',
  Opinion: '/opinion',
  Editorial: '/editorial',
};

/** Resolve the destination for a category, or null when it has no page. */
export function categoryHref(category: string): string | null {
  const county = COUNTIES.find((c) => c.name === category);
  if (county) return `/counties/${county.slug}`;
  return SECTION_ROUTES[category] ?? null;
}

/**
 * Small solid category slug. Counties and sections link to their own page so
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

  // Kitui's yellow accent needs dark text to stay legible (AA contrast).
  const needsDarkText = color.toLowerCase() === '#f2c94c';
  const style = needsDarkText
    ? { backgroundColor: color, color: '#123563' }
    : { backgroundColor: color };

  const href = linked ? categoryHref(category) : null;
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
