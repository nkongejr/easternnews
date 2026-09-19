import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { formatToday } from '@/lib/format';
import SearchBar from '@/components/shared/SearchBar';
import Wordmark from './Wordmark';

/**
 * Portal masthead: brand on the left, live search on the right.
 * Mirrors the Kenyanews header structure while keeping Eastern Newspaper
 * colours, wordmark and tagline.
 */
export default function Header() {
  return (
    <div className="border-b border-border bg-white">
      <div className="en-container flex items-center justify-between gap-6 py-3 md:py-4">
        <Link href="/" className="shrink-0" aria-label={`${SITE.name} — home`}>
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
