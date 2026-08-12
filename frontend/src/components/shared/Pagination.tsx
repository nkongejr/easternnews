import Link from 'next/link';

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
}: {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`${baseHref}?page=${p}`}
          className={`px-3 py-1 rounded border text-sm ${
            p === currentPage ? 'bg-brand-blue text-white border-brand-blue' : 'hover:bg-gray-100'
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}