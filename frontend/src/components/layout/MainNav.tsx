'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FaBars,
  FaChevronDown,
  FaMagnifyingGlass,
  FaXmark,
} from 'react-icons/fa6';
import { COUNTIES, MORE_NAV, PRIMARY_NAV, SITE } from '@/lib/constants';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import SearchBar from '@/components/shared/SearchBar';
import MobileNavigation from './MobileNavigation';

type MenuId = 'counties' | 'more' | null;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation. Sticks once the masthead scrolls away so section and
 * county desks stay one tap away.
 *
 * Desk bar treatment: condensed capitals on the logo's navy, a cyan hover
 * wash, and a cyan rule under the desk you are reading. Publications keeps
 * its yellow button so the print library stays the loudest item in the bar.
 */
export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const navRef = useRef<HTMLUListElement>(null);

  const inCounties = pathname.startsWith('/counties');
  const inMore = MORE_NAV.some((l) => isActive(pathname, l.href));

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  const menuPanel =
    'absolute left-0 top-full z-50 border border-border-strong border-t-2 border-t-brand-cyan bg-white p-4 shadow-2xl';

  /** Shared chrome for a desk-bar item. */
  const deskLink =
    'en-navlink flex h-12 items-center px-3.5 text-[12.5px] font-bold uppercase tracking-[0.09em] transition-colors hover:bg-white/10 hover:text-brand-cyan';

  return (
    <>
      <div className="sticky top-0 z-50 border-b-[3px] border-brand-secondary bg-brand-navy text-white shadow-sm">
        <div className="en-container">
          <div className="flex h-12 items-center justify-between gap-4 md:h-12">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="-ml-2 flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-brand-cyan"
              >
                <FaBars size={18} />
              </button>
              <Link href="/" className="min-w-0">
                {LOGO_SRC ? (
                  <span className="en-logo-frame en-logo-frame--sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={LOGO_SRC} alt={LOGO_ALT} className="en-logo" />
                  </span>
                ) : (
                  <span className="font-headline text-[15px] font-black tracking-[-0.02em] text-white">
                    {SITE.wordmarkTop}{' '}
                    <span className="text-brand-cyan">{SITE.wordmarkBottom}</span>
                  </span>
                )}
              </Link>
            </div>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul ref={navRef} className="flex items-center gap-0">
                {PRIMARY_NAV.map((l) => (
                  <li key={l.href}>
                    {l.highlight ? (
                      <Link
                        href={l.href}
                        aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                        className={`en-btn ml-2 inline-flex h-8 items-center px-3.5 text-[12px] shadow-sm transition-colors ${
                          isActive(pathname, l.href)
                            ? 'bg-white text-brand-navy'
                            : 'bg-brand-secondary text-brand-navy hover:bg-brand-secondary-dark'
                        }`}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <Link
                        href={l.href}
                        aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                        className={`${deskLink} ${
                          isActive(pathname, l.href) ? 'text-brand-secondary' : 'text-white/95'
                        }`}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}

                <li className="relative" onMouseLeave={() => openMenu === 'counties' && setOpenMenu(null)}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu((m) => (m === 'counties' ? null : 'counties'))}
                    aria-expanded={openMenu === 'counties'}
                    aria-haspopup="true"
                    aria-controls="counties-menu"
                    className={`${deskLink} gap-1.5 ${
                      inCounties ? 'en-navlink--active text-brand-secondary' : 'text-white/95'
                    }`}
                  >
                    Counties
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${openMenu === 'counties' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div
                    id="counties-menu"
                    hidden={openMenu !== 'counties'}
                    className={`${menuPanel} w-[440px]`}
                  >
                    <p className="en-kicker mb-3 text-muted">County desks</p>
                    <ul className="grid grid-cols-2 gap-x-4">
                      <li className="col-span-2">
                        <Link
                          href="/counties"
                          className="mb-1 block border-b-2 border-brand-navy py-2 font-condensed text-[13px] font-bold uppercase tracking-[0.08em] text-brand-navy transition-colors hover:text-brand-primary"
                        >
                          All county news
                        </Link>
                      </li>
                      {COUNTIES.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/counties/${c.slug}`}
                            className={`block border-b border-border py-2 text-sm font-semibold transition-colors hover:text-brand-primary ${
                              pathname === `/counties/${c.slug}` ? 'text-brand-primary' : 'text-text'
                            }`}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li className="relative" onMouseLeave={() => openMenu === 'more' && setOpenMenu(null)}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu((m) => (m === 'more' ? null : 'more'))}
                    aria-expanded={openMenu === 'more'}
                    aria-haspopup="true"
                    aria-controls="more-menu"
                    className={`${deskLink} gap-1.5 ${
                      inMore ? 'en-navlink--active text-brand-secondary' : 'text-white/95'
                    }`}
                  >
                    More
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${openMenu === 'more' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div
                    id="more-menu"
                    hidden={openMenu !== 'more'}
                    className={`${menuPanel} w-56`}
                  >
                    <p className="en-kicker mb-3 text-muted">More from the paper</p>
                    <ul>
                      {MORE_NAV.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                            className={`block border-b border-border py-2 text-sm font-semibold transition-colors hover:text-brand-primary ${
                              isActive(pathname, l.href) ? 'text-brand-primary' : 'text-text'
                            }`}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>

            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-expanded={searchOpen}
                aria-controls="nav-search"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                className="flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-brand-cyan"
              >
                {searchOpen ? <FaXmark size={16} /> : <FaMagnifyingGlass size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div id="nav-search" hidden={!searchOpen} className="border-t border-white/15 bg-brand-ink lg:hidden">
          <div className="en-container py-3">
            <SearchBar inputId="nav-search-input" onNavigate={() => setSearchOpen(false)} />
          </div>
        </div>
      </div>

      {mobileOpen && <MobileNavigation open onClose={() => setMobileOpen(false)} />}
    </>
  );
}
