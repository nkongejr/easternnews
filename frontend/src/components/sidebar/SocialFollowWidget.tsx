import Link from 'next/link';
import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { SITE } from '@/lib/constants';
import SidebarWidget from './SidebarWidget';

export default function SocialFollowWidget() {
  return (
    <SidebarWidget title="Follow Us" subtitle="Join the conversation">
      <div className="flex items-center gap-2">
        <Link
          href={SITE.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Eastern Newspaper on Facebook"
          className="flex h-10 w-10 items-center justify-center bg-brand-primary text-white transition-colors hover:bg-brand-primary-dark"
        >
          <FaFacebookF size={14} />
        </Link>
        <Link
          href={SITE.social.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Eastern Newspaper on X"
          className="flex h-10 w-10 items-center justify-center bg-ink text-white transition-colors hover:bg-black"
        >
          <FaXTwitter size={14} />
        </Link>
        <Link
          href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex h-10 w-10 items-center justify-center bg-[#25D366] text-white transition-colors hover:brightness-95"
        >
          <FaWhatsapp size={16} />
        </Link>
      </div>
    </SidebarWidget>
  );
}
