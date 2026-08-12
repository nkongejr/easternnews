'use client';

import Link from 'next/link';
import { useState } from 'react';
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

  return (
    <header className="bg-white border-b-4 border-brand-gold sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-2xl md:text-3xl font-headline font-black">
            <span className="text-brand-blue">EASTERN</span>{' '}
            <span className="text-brand-gold">NEWSPAPER</span>
          </span>
          <span className="text-xs italic text-gray-500">Be in the Know</span>
        </Link>

        <button className="lg:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaXmark /> : <FaBars />}
        </button>

        <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm uppercase tracking-wide">
          <Link href="/" className="hover:text-brand-blue">Home</Link>

          <div className="relative" onMouseEnter={() => setCountiesOpen(true)} onMouseLeave={() => setCountiesOpen(false)}>
            <button className="flex items-center gap-1 hover:text-brand-blue">
              Counties <FaChevronDown className="text-xs" />
            </button>
            {countiesOpen && (
              <div className="absolute top-full left-0 bg-white shadow-lg border rounded-md w-56 py-2 z-50">
                {COUNTIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/counties/${c.slug}`}
                    className="block px-4 py-2 text-sm normal-case hover:bg-brand-blue hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-blue">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1">
          <Link href="/" className="block py-2 font-semibold">Home</Link>
          <details>
            <summary className="py-2 font-semibold cursor-pointer">Counties</summary>
            <div className="pl-4">
              {COUNTIES.map((c) => (
                <Link key={c.slug} href={`/counties/${c.slug}`} className="block py-1 text-sm text-gray-700">
                  {c.name}
                </Link>
              ))}
            </div>
          </details>
          {NAV_LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 font-semibold">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}