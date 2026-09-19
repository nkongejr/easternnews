import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp, FaMagnifyingGlass } from 'react-icons/fa6';
import { SITE, TILL_NUMBER, SHOW_MPESA_TILL } from '@/lib/constants';
import TodayDate from '@/components/shared/TodayDate';

/**
 * Slim utility strip above the masthead.
 * On mobile this strip IS the dateline (Kenyanews-style) — the single
 * auto-updating date, with no till badge competing for space.
 */
export default function TopBar() {
  return (
    <div className="bg-brand-blue-darker text-white">
      {/* Mobile dateline */}
      <div className="en-container flex h-8 items-center justify-between gap-3 text-[11px] md:hidden">
        <p className="min-w-0 truncate font-semibold tracking-wide text-white">
          <TodayDate />
        </p>
        {SHOW_MPESA_TILL && (
          <span className="shrink-0 rounded-sm bg-brand-gold px-2 py-0.5 font-bold text-brand-blue-darker">
            Till {TILL_NUMBER}
          </span>
        )}
      </div>

      {/* Desktop strip */}
      <div className="en-container hidden h-9 items-center justify-between gap-6 text-[11px] md:flex">
        <p className="truncate font-semibold tracking-wide text-white/70">
          <TodayDate />
        </p>

        <div className="flex items-center gap-5">
          {SHOW_MPESA_TILL && (
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-brand-gold px-2 py-1 font-bold text-brand-blue-darker">
              M-PESA Buy Goods Till: {TILL_NUMBER}
            </span>
          )}

          <nav aria-label="Secondary" className="flex items-center gap-4">
            <Link href="/search" className="text-white/75 transition-colors hover:text-brand-secondary">
              Search
            </Link>
            <Link href="/archive" className="text-white/75 transition-colors hover:text-brand-gold">
              Back Issues
            </Link>
            <Link href="/advertisers" className="text-white/75 transition-colors hover:text-brand-gold">
              Advertisers
            </Link>
            <Link href="/contact" className="text-white/75 transition-colors hover:text-brand-gold">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3 border-l border-white/15 pl-4">
            <Link
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on Facebook"
              className="text-white/70 transition-colors hover:text-brand-gold"
            >
              <FaFacebookF size={12} />
            </Link>
            <Link
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on X"
              className="text-white/70 transition-colors hover:text-brand-gold"
            >
              <FaXTwitter size={12} />
            </Link>
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="text-white/70 transition-colors hover:text-brand-gold"
            >
              <FaWhatsapp size={12} />
            </Link>
            <Link
              href="/search"
              aria-label="Search"
              className="text-white/70 transition-colors hover:text-brand-secondary"
            >
              <FaMagnifyingGlass size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
