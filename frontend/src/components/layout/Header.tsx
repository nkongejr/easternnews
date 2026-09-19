import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { formatToday } from '@/lib/format';

/**
 * Newspaper masthead. The wordmark is type-set (no raster logo shipped in the
 * repo), so it stays razor sharp at every breakpoint and costs zero bytes.
 */
export default function Header() {
  return (
    <div className="border-b border-border bg-white">
      <div className="en-container flex flex-col items-center gap-3 py-4 md:flex-row md:justify-between md:gap-8 md:py-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex flex-col items-center text-center md:items-start md:text-left"
          aria-label={`${SITE.name} — home`}
        >
          <span className="flex flex-wrap items-baseline justify-center gap-x-2 leading-none md:justify-start">
            <span className="font-headline text-[24px] font-black tracking-tight text-brand-blue sm:text-3xl md:text-4xl lg:text-[42px]">
              {SITE.wordmarkTop}
            </span>
            <span className="font-headline text-[24px] font-black tracking-tight text-brand-gold sm:text-3xl md:text-4xl lg:text-[42px]">
              {SITE.wordmarkBottom}
            </span>
          </span>
          <span className="mt-1.5 flex items-center gap-2">
            <span className="h-px w-6 bg-brand-gold" aria-hidden="true" />
            <span className="font-headline text-[11px] italic text-muted sm:text-xs">
              {SITE.tagline}
            </span>
            <span className="h-px w-6 bg-brand-gold" aria-hidden="true" />
          </span>
        </Link>

        {/* Utility cluster */}
        <div className="flex shrink-0 items-center gap-3">
          {/*
            Dateline. The utility strip that normally carries it is hidden below
            md, so the masthead carries it there instead — a dateline is masthead
            furniture on a newspaper and should never disappear on a phone.
          */}
          <p className="en-dateline text-muted md:hidden">{formatToday()}</p>

          <p className="hidden text-right text-[11px] leading-tight text-muted lg:block">
            Regional monthly newspaper
            <br />
            <span className="font-semibold text-ink">{SITE.city}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
