import { CATEGORY_COLORS } from '@/lib/constants';

export default function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || '#1a4d8f';
  return (
    <span
      className="inline-block text-white text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5"
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
}
