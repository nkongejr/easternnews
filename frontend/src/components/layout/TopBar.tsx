import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp, FaMagnifyingGlass } from 'react-icons/fa6';
import { SITE, TILL_NUMBER, SHOW_MPESA_TILL } from '@/lib/constants';
import TodayDate from '@/components/shared/TodayDate';

/**
 * Slim utility strip above the masthead — the near-black "ear" of the front
 * page: dateline, desk shortcuts and socials.
 *
 * On mobile this strip IS the dateline: the single auto-updating date, with
 * no till badge competing for space.
 */
export default function TopBar() {
  const utilityLink =
    'font-condensed text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-brand-cyan';

  return (
    <div className="border-b border-white/10 bg-brand-ink text-white">
      {/* Mobile dateline */}
      <div className="en-container flex h-9 items-center justify-between gap-3 text-[11px] md:hidden">
        <p className="min-w-0 truncate font-condensed font-bold uppercase tracking-[0.12em] text-white">
          <TodayDate />
        </p>
        {SHOW_MPESA_TILL && (
          <span className="shrink-0 bg-brand-secondary px-2 py-0.5 font-condensed text-[10px] font-black uppercase tracking-wider text-brand-navy">
            Till {TILL_NUMBER}
          </span>
        )}
      </div>

      {/* Desktop strip */}
      <div className="en-container hidden h-10 items-center justify-between gap-6 text-[11px] md:flex">
        <p className="truncate font-condensed font-bold uppercase tracking-[0.14em] text-white/60">
          <TodayDate />
        </p>

        <div className="flex items-center gap-5">
          {SHOW_MPESA_TILL && (
            <span className="inline-flex items-center gap-1.5 bg-brand-secondary px-2 py-1 font-condensed text-[10px] font-black uppercase tracking-wider text-brand-navy">
              M-PESA Buy Goods Till: {TILL_NUMBER}
            </span>
          )}

          <nav aria-label="Secondary" className="flex items-center gap-4">
            <Link href="/search" className={utilityLink}>
              Search
            </Link>
            <Link href="/publications" className={utilityLink}>
              Publications
            </Link>
            <Link href="/advertisers" className={utilityLink}>
              Advertisers
            </Link>
            <Link href="/contact" className={utilityLink}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3.5 border-l border-white/15 pl-4">
            <Link
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on Facebook"
              className="text-white/60 transition-colors hover:text-brand-cyan"
            >
              <FaFacebookF size={12} />
            </Link>
            <Link
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on X"
              className="text-white/60 transition-colors hover:text-brand-cyan"
            >
              <FaXTwitter size={12} />
            </Link>
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="text-white/60 transition-colors hover:text-brand-cyan"
            >
              <FaWhatsapp size={12} />
            </Link>
            <Link
              href="/search"
              aria-label="Search"
              className="text-white/60 transition-colors hover:text-brand-cyan"
            >
              <FaMagnifyingGlass size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
