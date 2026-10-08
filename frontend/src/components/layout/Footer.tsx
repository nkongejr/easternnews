import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { CONTACT, COUNTIES, MORE_NAV, PRIMARY_NAV, SITE, TILL_NUMBER, SHOW_MPESA_TILL } from '@/lib/constants';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Advertise With Us', href: '/advertise' },
  { label: 'Advertiser Directory', href: '/advertisers' },
  { label: 'Publications', href: '/publications' },
  { label: 'Newsletter', href: '/contact#newsletter' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

/** Only link mailto: for addresses that actually carry a domain. */
const deliverable = (email: string) => /\.[a-z]{2,}$/i.test(email);

/**
 * Newspaper footer: masthead statement, sections, the full county index and
 * the publisher's contact details, over a colophon strip.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t-4 border-brand-secondary bg-brand-navy text-white">
      <div className="en-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            {LOGO_SRC ? (
              <span className="en-logo-frame en-logo-frame--md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_SRC} alt={LOGO_ALT} className="en-logo" />
              </span>
            ) : (
              <p className="font-headline text-[26px] font-black leading-[1.05] tracking-[-0.02em]">
                {SITE.wordmarkTop}
                <br />
                <span className="text-brand-cyan">{SITE.wordmarkBottom}</span>
              </p>
            )}
            <p className="mt-4 border-l-2 border-brand-secondary pl-3 font-headline text-sm italic text-white/75">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-white/70">{SITE.description}</p>
            {SHOW_MPESA_TILL && (
              <p className="mt-4 inline-block bg-brand-secondary px-2.5 py-1 font-condensed text-[10px] font-black uppercase tracking-wider text-brand-navy">
                M-PESA Till: {TILL_NUMBER}
              </p>
            )}
          </div>

          {/* Sections */}
          <nav aria-labelledby="footer-sections">
            <h2 id="footer-sections" className="en-kicker mb-4 text-brand-cyan">
              Sections
            </h2>
            <ul className="space-y-2.5">
              {[...PRIMARY_NAV, ...MORE_NAV, ...QUICK_LINKS].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-cyan"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Counties */}
          <nav aria-labelledby="footer-counties">
            <h2 id="footer-counties" className="en-kicker mb-4 text-brand-cyan">
              Counties
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {COUNTIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/counties/${c.slug}`}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-cyan"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="en-kicker mb-4 text-brand-cyan">Contact Us</h2>
            <address className="space-y-2.5 text-[13px] not-italic leading-relaxed text-white/70">
              <p>
                {CONTACT.address}
                <br />
                {CONTACT.postal}
              </p>
              <p>
                Tel:{' '}
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-brand-cyan">
                  {CONTACT.phones.join(' / ')}
                </a>
              </p>
            </address>

            <dl className="mt-4 space-y-2 text-[13px]">
              {CONTACT.deskEmails.map((d) => (
                <div key={d.email}>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                    {d.label}
                  </dt>
                  <dd className="break-all text-white/80">
                    {deliverable(d.email) ? (
                      <a href={`mailto:${d.email}`} className="hover:text-brand-cyan">
                        {d.email}
                      </a>
                    ) : (
                      d.email
                    )}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                  Verified email
                </dt>
                <dd className="break-all">
                  <a
                    href={`mailto:${CONTACT.verifiedEmail}`}
                    className="text-white/80 hover:text-brand-cyan"
                  >
                    {CONTACT.verifiedEmail}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Eastern News on Facebook"
                className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-navy"
              >
                <FaFacebookF size={13} />
              </Link>
              <Link
                href={SITE.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Eastern News on X"
                className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-navy"
              >
                <FaXTwitter size={13} />
              </Link>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-navy"
              >
                <FaWhatsapp size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-white/10 bg-brand-ink">
        <div className="en-container flex flex-col gap-3 py-5 text-[11px] leading-relaxed text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name}. Published monthly by {SITE.publisher}
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-cyan">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sitemap.xml" className="transition-colors hover:text-brand-cyan">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
