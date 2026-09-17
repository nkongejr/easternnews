'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaXmark } from 'react-icons/fa6';
import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { COUNTIES, NAV_LINKS, SITE, TILL_NUMBER } from '@/lib/constants';
import SearchBar from '@/components/shared/SearchBar';

/**
 * Full-height off-canvas menu for phones and tablets.
 * - native <details> for the county list (keyboard + screen-reader friendly)
 * - focus is trapped-ish by focusing the panel on open
 * - Escape closes, route change closes, background scroll is locked
 */
export default function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [countiesOpen, setCountiesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/50"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="relative h-full w-[86%] max-w-sm overflow-y-auto bg-white outline-none"
      >
        <div className="flex items-center justify-between border-b border-border bg-brand-blue px-4 py-3">
          <span className="font-headline text-lg font-black text-white">
            {SITE.wordmarkTop} <span className="text-brand-gold">{SITE.wordmarkBottom}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-white/90 hover:text-brand-gold"
          >
            <FaXmark size={20} />
          </button>
        </div>

        <div className="px-4 py-4">
          <SearchBar onNavigate={onClose} />
        </div>

        <nav aria-label="Primary" className="border-t border-border">
          <ul className="divide-y divide-border">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3.5 font-headline text-lg font-bold text-ink"
              >
                Home
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setCountiesOpen((v) => !v)}
                aria-expanded={countiesOpen}
                aria-controls="mobile-counties"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left font-headline text-lg font-bold text-ink"
              >
                Counties
                <FaChevronDown
                  size={14}
                  className={`text-muted transition-transform ${countiesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <ul
                id="mobile-counties"
                hidden={!countiesOpen}
                className="grid grid-cols-2 gap-x-2 gap-y-1 border-t border-border bg-surface-alt px-4 py-3"
              >
                {COUNTIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/counties/${c.slug}`}
                      onClick={onClose}
                      className="block py-2 text-sm font-semibold text-ink/80 hover:text-brand-blue"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {NAV_LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="block px-4 py-3.5 font-headline text-lg font-bold text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 space-y-4 border-t border-border px-4 py-6">
          <p className="rounded-sm bg-brand-gold px-3 py-2 text-center text-[11px] font-bold text-brand-blue-darker">
            M-PESA Buy Goods Till: {TILL_NUMBER}
          </p>
          <div className="flex items-center justify-center gap-5">
            <Link
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on Facebook"
              className="text-muted hover:text-brand-blue"
            >
              <FaFacebookF size={16} />
            </Link>
            <Link
              href={SITE.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Eastern News on X"
              className="text-muted hover:text-brand-blue"
            >
              <FaXTwitter size={16} />
            </Link>
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(`${SITE.name} — ${SITE.tagline}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="text-muted hover:text-brand-blue"
            >
              <FaWhatsapp size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
