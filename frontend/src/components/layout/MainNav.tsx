'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaBars, FaChevronDown, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { COUNTIES, NAV_LINKS, SITE } from '@/lib/constants';
import SearchBar from '@/components/shared/SearchBar';
import MobileNavigation from './MobileNavigation';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation bar. Sticks to the top of the viewport once the masthead
 * scrolls away, so county/section navigation is always one click from anywhere
 * on the page — the same behaviour as the large Kenyan news portals.
 */
export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countiesOpen, setCountiesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const countiesRef = useRef<HTMLLIElement>(null);

  // Close transient UI when the route changes. Adjusting state during render
  // (rather than in an effect) avoids a cascade of extra renders.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setCountiesOpen(false);
    setSearchOpen(false);
  }

  // Dismiss the counties dropdown on outside click / Escape.
  useEffect(() => {
    if (!countiesOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!countiesRef.current?.contains(e.target as Node)) setCountiesOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCountiesOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [countiesOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-brand-gold bg-brand-blue text-white shadow-sm">
        <div className="en-container">
          <div className="flex h-12 items-center justify-between gap-4 md:h-14">
            {/* Mobile: hamburger + compact wordmark */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="-ml-2 flex h-11 w-11 items-center justify-center text-white hover:text-brand-gold"
              >
                <FaBars size={18} />
              </button>
              <span className="font-headline text-sm font-black tracking-tight text-white">
                {SITE.wordmarkTop}
                <span className="text-brand-gold">{SITE.wordmarkBottom}</span>
              </span>
            </div>

            {/* Desktop: full menu */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                <li>
                  <Link
                    href="/"
                    aria-current={isActive(pathname, '/') ? 'page' : undefined}
                    className={`block px-3 py-4 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-brand-blue-darker hover:text-brand-gold ${
                      isActive(pathname, '/') ? 'text-brand-gold' : 'text-white'
                    }`}
                  >
                    Home
                  </Link>
                </li>

                <li
                  ref={countiesRef}
                  className="relative"
                  onMouseLeave={() => setCountiesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setCountiesOpen((v) => !v)}
                    aria-expanded={countiesOpen}
                    aria-haspopup="true"
                    aria-controls="counties-menu"
                    className={`flex items-center gap-1.5 px-3 py-4 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-brand-blue-darker hover:text-brand-gold ${
                      pathname.startsWith('/counties') ? 'text-brand-gold' : 'text-white'
                    }`}
                  >
                    Counties
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${countiesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div
                    id="counties-menu"
                    hidden={!countiesOpen}
                    className="absolute left-0 top-full z-50 w-[420px] border border-border bg-white p-4 shadow-xl"
                  >
                    <p className="en-kicker mb-3 text-muted">County desks</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      {COUNTIES.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/counties/${c.slug}`}
                            className={`block border-b border-border/70 py-2 text-sm font-semibold transition-colors hover:text-brand-blue ${
                              pathname === `/counties/${c.slug}` ? 'text-brand-blue' : 'text-ink/85'
                            }`}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {NAV_LINKS.slice(1).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                      className={`block px-3 py-4 text-[13px] font-bold uppercase tracking-wide transition-colors hover:bg-brand-blue-darker hover:text-brand-gold ${
                        isActive(pathname, l.href) ? 'text-brand-gold' : 'text-white'
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Search */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-expanded={searchOpen}
                aria-controls="nav-search"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                className="flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-brand-gold"
              >
                {searchOpen ? <FaXmark size={16} /> : <FaMagnifyingGlass size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanding search drawer */}
        <div
          id="nav-search"
          hidden={!searchOpen}
          className="border-t border-white/15 bg-brand-blue-darker"
        >
          <div className="en-container py-3">
            <SearchBar
              onNavigate={() => setSearchOpen(false)}
              className="[&_input]:border-0 [&_input]:bg-white [&_input]:text-ink"
            />
          </div>
        </div>
      </header>

      {mobileOpen && <MobileNavigation open onClose={() => setMobileOpen(false)} />}
    </>
  );
}
