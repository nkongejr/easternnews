import Link from 'next/link';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { TILL_NUMBER } from '@/lib/constants';

export default function TopBar() {
  return (
    <div className="bg-brand-blue-dark text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-brand-gold text-brand-blue-dark font-bold px-2 py-1 rounded text-xs">
            M-PESA Buy Goods Till: {TILL_NUMBER}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
            <FaFacebookF className="hover:text-brand-gold" />
          </Link>
          <Link href="https://x.com" target="_blank" aria-label="X / Twitter">
            <FaXTwitter className="hover:text-brand-gold" />
          </Link>
          <Link href="/search" aria-label="Search">
            <FaSearch className="hover:text-brand-gold" />
          </Link>
        </div>
      </div>
    </div>
  );
}