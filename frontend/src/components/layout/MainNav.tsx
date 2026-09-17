'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { COUNTIES } from '@/lib/constants';
import { FaBars, FaXmark, FaChevronDown } from 'react-icons/fa6';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Editorial', href: '/editorial' },
  { label: 'About', href: '/about' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Contact', href: '/contact' },
];

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countiesOpen, setCountiesOpen] = useState(false);

  // Close mobile drawer with Escape and lock body scroll while open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close counties dropdown on outside click
  useEffect(() => {
    if (!countiesOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('[data-counties-nav]')) setCountiesOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [countiesOpen]);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Gold masthead rule */}
      <div className="h-1 bg-brand-gold" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Masthead */}
          <Link href="/" className="flex flex-col leading-none" aria-label="Eastern Newspaper home">
            <span className="font-headline font-black text-2xl md:text-4xl tracking-tight">
              <span className="text-brand-blue">EASTERN</span>{' '}
              <span className="text-brand-gold">NEWSPAPER</span>
            </span>
            <span className="text-[10px] md:text-xs italic text-gray-500 mt-1 uppercase tracking-[0.2em]">
              Be in the Know
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-11 h-11 text-2xl text-brand-blue-dark border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-7 font-semibold text-[13px] uppercase tracking-wide text-gray-800"
            aria-label="Primary"
          >
            {NAV_LINKS.slice(0, 1).map((l) => (
              <Link key={l.href} href={l.href} className="py-2 border-b-2 border-transparent hover:text-brand-blue hover:border-brand-gold transition-colors">
                {l.label}
              </Link>
            ))}

            <div
              className="relative"
              data-counties-nav
              onMouseEnter={() => setCountiesOpen(true)}
              onMouseLeave={() => setCountiesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 py-2 border-b-2 border-transparent hover:text-brand-blue hover:border-brand-gold transition-colors"
                aria-expanded={countiesOpen}
                aria-haspopup="true"
                onClick={() => setCountiesOpen((o) => !o)}
              >
                Counties <FaChevronDown className="text-[10px]" aria-hidden="true" />
              </button>
              {countiesOpen && (
                <div
                  className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg w-64 py-2 z-50 max-h-[70vh] overflow-y-auto"
                  role="menu"
                >
                  {COUNTIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/counties/${c.slug}`}
                      role="menuitem"
                      className="block px-4 py-2 text-sm normal-case font-normal hover:bg-paper-muted hover:text-brand-blue transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2 border-b-2 border-transparent hover:text-brand-blue hover:border-brand-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div id="mobile-nav" className="lg:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="px-4 py-3 space-y-0.5" aria-label="Mobile primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-3 font-headline font-bold text-lg border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <details className="py-1">
              <summary className="py-2 font-headline font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                Counties
                <FaChevronDown className="text-sm text-gray-400" aria-hidden="true" />
              </summary>
              <div className="pl-3 pb-2">
                {COUNTIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/counties/${c.slug}`}
                    className="block py-2 text-sm text-gray-700 border-b border-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </details>
          </nav>
        </div>
      )}
    </header>
  );
}
