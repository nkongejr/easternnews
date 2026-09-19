import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { CONTACT, COUNTIES, MORE_NAV, PRIMARY_NAV, SITE, TILL_NUMBER } from '@/lib/constants';

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Advertise With Us', href: '/advertise' },
  { label: 'Advertiser Directory', href: '/advertisers' },
  { label: 'Back Issues', href: '/archive' },
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
    <footer className="mt-14 bg-brand-primary-darker text-white">
      <div className="en-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <p className="font-headline text-2xl font-black leading-none">
              {SITE.wordmarkTop}
              <br />
              <span className="text-brand-secondary">{SITE.wordmarkBottom}</span>
            </p>
            <p className="mt-3 border-l-2 border-brand-secondary pl-3 font-headline text-sm italic text-white/70">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-white/70">{SITE.description}</p>
            <p className="mt-4 inline-block rounded-sm bg-brand-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary-darker">
              M-PESA Till: {TILL_NUMBER}
            </p>
          </div>

          {/* Sections */}
          <nav aria-labelledby="footer-sections">
            <h2 id="footer-sections" className="en-kicker mb-4 text-brand-secondary">
              Sections
            </h2>
            <ul className="space-y-2.5">
              {[...PRIMARY_NAV, ...MORE_NAV, ...QUICK_LINKS].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-secondary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Counties */}
          <nav aria-labelledby="footer-counties">
            <h2 id="footer-counties" className="en-kicker mb-4 text-brand-secondary">
              Counties
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {COUNTIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/counties/${c.slug}`}
                    className="text-[13px] text-white/70 transition-colors hover:text-brand-secondary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="en-kicker mb-4 text-brand-secondary">Contact Us</h2>
            <address className="space-y-2.5 text-[13px] not-italic leading-relaxed text-white/70">
              <p>
                {CONTACT.address}
                <br />
                {CONTACT.postal}
              </p>
              <p>
                Tel:{' '}
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-brand-secondary">
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
                      <a href={`mailto:${d.email}`} className="hover:text-brand-secondary">
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
                    className="text-white/80 hover:text-brand-secondary"
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
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-primary-darker"
              >
                <FaFacebookF size={13} />
              </Link>
              <Link
                href={SITE.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Eastern News on X"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-primary-darker"
              >
                <FaXTwitter size={13} />
              </Link>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-secondary hover:text-brand-primary-darker"
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
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-secondary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sitemap.xml" className="transition-colors hover:text-brand-secondary">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
