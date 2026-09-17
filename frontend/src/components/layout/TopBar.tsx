import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SITE, TILL_NUMBER } from '@/lib/constants';
import { formatToday } from '@/lib/format';

/**
 * Slim utility strip above the masthead: dateline, the paper's M-PESA till,
 * secondary links and social accounts. Deliberately low-contrast so it reads
 * as furniture rather than competing with the news.
 */
export default function TopBar() {
  return (
    <div className="hidden bg-brand-blue-darker text-white md:block">
      <div className="en-container flex h-9 items-center justify-between gap-6 text-[11px]">
        <p className="truncate font-semibold tracking-wide text-white/70">
          {formatToday()}
        </p>

        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-brand-gold px-2 py-1 font-bold text-brand-blue-darker">
            M-PESA Buy Goods Till: {TILL_NUMBER}
          </span>

          <nav aria-label="Secondary" className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
