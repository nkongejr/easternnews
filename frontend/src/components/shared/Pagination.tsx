import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

/** Windowed pager — never renders more than ~7 controls. */
function pageWindow(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 0, total]; // 0 = ellipsis marker
  if (current >= total - 3) return [1, 0, total - 4, total - 3, total - 2, total - 1, total];
  return [1, 0, current - 1, current, current + 1, 0, total];
}

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

  const pages = pageWindow(currentPage, totalPages);
  const href = (p: number) => (p === 1 ? baseHref : `${baseHref}?page=${p}`);

  const base =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm font-semibold transition-colors';

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          className={`${base} border-border text-ink hover:border-brand-blue hover:text-brand-blue`}
        >
          <FaChevronLeft size={11} />
        </Link>
      )}

      {pages.map((p, i) =>
        p === 0 ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`${base} ${
              p === currentPage
                ? 'border-brand-blue bg-brand-blue text-white'
                : 'border-border text-ink hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          className={`${base} border-border text-ink hover:border-brand-blue hover:text-brand-blue`}
        >
          <FaChevronRight size={11} />
        </Link>
      )}
    </nav>
  );
}
