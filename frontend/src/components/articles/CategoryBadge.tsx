import { CATEGORY_COLORS } from '@/lib/constants';

export default function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || '#1a4d8f';
  return (
    <span
      className="inline-block text-white text-xs font-bold uppercase px-2 py-1 rounded"
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
}