import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { formatToday } from '@/lib/format';
import SearchBar from '@/components/shared/SearchBar';
import Wordmark from './Wordmark';

/**
 * Portal masthead: brand on the left, live search and the edition dateline
 * on the right, closed by the logo's cyan→blue→yellow rule.
 *
 * Same structure and same behaviour as before — the logo links home, the
 * search field posts to /search — only the nameplate treatment changed.
 * No date here on mobile: the TopBar dateline is the single auto-updating
 * date on phones.
 */
export default function Header() {
  return (
    <div className="en-masthead border-b border-border bg-white">
      <div className="en-container flex items-center justify-between gap-6 py-4 md:py-5">
        <Link
          href="/"
          className="min-w-0 shrink-0 transition-opacity hover:opacity-90"
          aria-label={`${SITE.name} — home`}
        >
          <Wordmark size="lg" />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-6 md:flex">
          <div className="w-full max-w-md">
            <SearchBar inputId="header-search" placeholder="Search articles…" />
          </div>

          {/* Edition line — the dateline a printed front page carries. */}
          <p className="hidden shrink-0 border-l border-border pl-5 text-right leading-tight xl:block">
            <span className="en-dateline block text-brand-navy">{formatToday()}</span>
            <span className="mt-1 block font-condensed text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              {SITE.city}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
