import Link from 'next/link';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { FaSearch, FaEnvelope } from 'react-icons/fa';
import { TILL_NUMBER } from '@/lib/constants';

export default function TopBar() {
  return (
    <div className="bg-brand-blue-dark text-white text-xs border-b border-black/20">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* Left: edition identity */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden md:inline uppercase tracking-[0.12em] font-semibold">
            Regional News for Kenya&rsquo;s Eastern Region
          </span>
          <span className="md:hidden uppercase tracking-[0.12em] font-semibold">
            Eastern Region
          </span>
        </div>

        {/* Right: M-PESA till, contact, social, search */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="bg-brand-gold text-brand-blue-dark font-bold px-2 py-0.5 text-[11px] uppercase tracking-wide">
            M-PESA Till {TILL_NUMBER}
          </span>
          <a
            href="mailto:info@easternnewspaper.co.ke"
            className="hidden lg:flex items-center gap-1.5 hover:text-brand-gold transition-colors"
          >
            <FaEnvelope aria-hidden="true" />
            info@easternnewspaper.co.ke
          </a>
          <span className="hidden sm:flex items-center gap-3" aria-label="Social media">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Eastern Newspaper on Facebook" className="hover:text-brand-gold transition-colors">
              <FaFacebookF aria-hidden="true" />
            </Link>
            <Link href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Eastern Newspaper on X" className="hover:text-brand-gold transition-colors">
              <FaXTwitter aria-hidden="true" />
            </Link>
          </span>
          <Link
            href="/search"
            aria-label="Search Eastern Newspaper"
            className="flex items-center gap-1.5 hover:text-brand-gold transition-colors"
          >
            <FaSearch aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
