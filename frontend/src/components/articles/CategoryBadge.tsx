import Link from 'next/link';
import { CATEGORY_COLORS, DEFAULT_ACCENT } from '@/lib/constants';
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

  // Kitui's yellow accent needs dark text to stay legible (AA contrast).
  const needsDarkText = color.toLowerCase() === '#f2c94c';
  const style = needsDarkText
    ? { backgroundColor: color, color: '#123563' }
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
