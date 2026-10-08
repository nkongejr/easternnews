'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Advertiser } from '@/types';

/** One storage key per advertiser so a different campaign can still appear. */
const CLOSED_KEY = 'en:article-ad-closed';

/**
 * The advert that closes over the article.
 *
 * A slim, clearly-labelled bar that slides up from the bottom of the viewport
 * once the reader is properly into the story — never while the headline and
 * lead image are still on screen, so the opening of the article always reads
 * clean. It stays put as the reader scrolls, steps aside once the comment
 * section arrives (so it never sits over the discussion or the footer), and one
 * tap on the close button puts it away for the rest of that reader's session
 * (sessionStorage, so a new visit starts fresh). Keyboard and screen-reader
 * friendly: the bar is out of the tab order while hidden and the close control
 * is a real button.
 */
export default function StickyAdBar({ advertiser }: { advertiser: Advertiser }) {
  const [inView, setInView] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    const key = `${CLOSED_KEY}:${advertiser._id}`;
    try {
      dismissed.current = sessionStorage.getItem(key) === '1';
    } catch {
      // Storage unavailable (private mode) — show the advert as normal.
      dismissed.current = false;
    }

    // The discussion at the foot of the article: the advert gets out of the way
    // as soon as it comes into view.
    const comments = document.getElementById('comments');

    const onScroll = () => {
      if (dismissed.current) {
        setInView(false);
        return;
      }
      const scrolled = window.scrollY;
      const remaining = document.documentElement.scrollHeight - window.innerHeight;
      const progress = remaining > 0 ? scrolled / remaining : 0;
      const reachedDiscussion =
        !!comments && comments.getBoundingClientRect().top < window.innerHeight - 80;
      setInView(!reachedDiscussion && (scrolled > 700 || progress > 0.15));
    };

    // First check on the next frame rather than synchronously in the effect.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [advertiser._id]);

  const close = () => {
    try {
      sessionStorage.setItem(`${CLOSED_KEY}:${advertiser._id}`, '1');
    } catch {
      // Nothing to persist to; the bar still closes for this page view.
    }
    dismissed.current = true;
    setInView(false);
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 ${
        inView ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-8 opacity-0'
      }`}
    >
      <aside
        aria-label="Advertisement"
        data-ad-placement="article-overlay"
        className="pointer-events-auto w-full max-w-xl rounded-sm border border-border-strong bg-white shadow-[0_12px_36px_rgba(7,44,60,0.24)]"
      >
        <div className="flex items-center gap-3 p-3 sm:p-3.5">
          {advertiser.logo && (
            <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-border sm:block">
              <Image
                src={advertiser.logo}
                alt={`${advertiser.businessName} logo`}
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
              Advertisement
            </p>
            <p className="truncate font-headline text-[15px] font-bold leading-snug text-ink">
              {advertiser.linkURL ? (
                <Link
                  href={advertiser.linkURL}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="hover:text-brand-primary"
                >
                  {advertiser.businessName}
                </Link>
              ) : (
                advertiser.businessName
              )}
            </p>
            <p className="truncate text-[12px] text-muted">
              {advertiser.description || advertiser.contact?.phone || advertiser.category}
            </p>
          </div>

          {advertiser.linkURL && (
            <Link
              href={advertiser.linkURL}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="hidden shrink-0 rounded-sm bg-brand-primary px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-primary-dark sm:inline-block"
            >
              Visit
            </Link>
          )}

          <button
            type="button"
            onClick={close}
            aria-label="Close advertisement"
            title="Close advertisement"
            className="-m-1 shrink-0 rounded-sm p-2 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </aside>
    </div>
  );
}
