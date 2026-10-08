import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { formatToday } from '@/lib/format';
import SearchBar from '@/components/shared/SearchBar';
import Wordmark from './Wordmark';

/**
 * Portal masthead: brand on the left, live search on the right.
 * Mirrors the Kenyanews header structure while keeping Eastern Newspaper
 * colours, wordmark and tagline. No date here on mobile — the TopBar
 * dateline is the single auto-updating date on phones.
 *
 * On phones the wordmark spans the full header width (the search field and
 * dateline only appear from md up), so the masthead carries no dead space.
 */
export default function Header() {
  return (
    <div className="border-b border-border bg-white">
      <div className="en-container flex items-center justify-between gap-6 py-3 md:py-4">
        <Link
          href="/"
          className="w-full min-w-0 md:w-auto md:shrink-0"
          aria-label={`${SITE.name} — home`}
        >
          <Wordmark size="lg" />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-6 md:flex">
          <div className="w-full max-w-md">
            <SearchBar inputId="header-search" placeholder="Search articles…" />
          </div>
          <p className="hidden shrink-0 text-right text-[11px] leading-tight text-muted xl:block">
            {formatToday()}
            <br />
            <span className="font-semibold text-ink">{SITE.city}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
