import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { COUNTIES, NAV_LINKS, SITE, TILL_NUMBER } from '@/lib/constants';

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Advertise With Us', href: '/advertise' },
  { label: 'Advertiser Directory', href: '/advertisers' },
  { label: 'Back Issues', href: '/archive' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Search', href: '/search' },
];

/**
 * Newspaper footer: brand + masthead statement, quick links, the full county
 * index, and the publisher's real contact details, over a colophon strip.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 bg-brand-blue-darker text-white">
      <div className="en-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <p className="font-headline text-2xl font-black leading-none">
              {SITE.wordmarkTop}
              <br />
              <span className="text-brand-gold">{SITE.wordmarkBottom}</span>
            </p>
            <p className="mt-3 border-l-2 border-brand-gold pl-3 font-headline text-sm italic text-white/70">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-white/65">{SITE.description}</p>
            <p className="mt-4 inline-block rounded-sm bg-brand-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue-darker">
              M-PESA Till: {TILL_NUMBER}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-labelledby="footer-links">
            <h2 id="footer-links" className="en-kicker mb-4 text-brand-gold">
              Sections
            </h2>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {NAV_LINKS.filter((l) => l.href !== '/').map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Counties */}
          <nav aria-labelledby="footer-counties">
            <h2 id="footer-counties" className="en-kicker mb-4 text-brand-gold">
              Counties
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {COUNTIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/counties/${c.slug}`}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="en-kicker mb-4 text-brand-gold">Contact Us</h2>
            <address className="space-y-2.5 text-[13px] not-italic leading-relaxed text-white/70">
              <p>
                {SITE.address}
                <br />
                {SITE.postal}
              </p>
              <p>
                Tel:{' '}
                <a href={SITE.phoneHref} className="transition-colors hover:text-brand-gold">
                  {SITE.phoneLabel}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all transition-colors hover:text-brand-gold"
                >
                  {SITE.email}
                </a>
              </p>
            </address>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Eastern News on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-gold hover:text-brand-blue-darker"
              >
                <FaFacebookF size={13} />
              </Link>
              <Link
                href={SITE.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Eastern News on X"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-gold hover:text-brand-blue-darker"
              >
                <FaXTwitter size={13} />
              </Link>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-gold hover:text-brand-blue-darker"
              >
                <FaWhatsapp size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-white/10">
        <div className="en-container flex flex-col gap-3 py-5 text-[11px] leading-relaxed text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name}. Published monthly by {SITE.publisher}
          </p>
          <p className="md:text-right">
            {SITE.address}, {SITE.postal} · Tel {SITE.phoneLabel} · {SITE.email} ·{' '}
            {SITE.altEmail}
          </p>
        </div>
      </div>
    </footer>
  );
}
