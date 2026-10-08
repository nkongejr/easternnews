'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Advertiser } from '@/types';

/** One storage key per advertiser so a different campaign can still appear. */
const CLOSED_KEY = 'en:article-ad-closed';

/** How long each appearance lasts before it slides away on its own. */
const AUTO_HIDE_MS = 8000;
/** How far the reader must have scrolled before the bar may appear. */
const START_AFTER_PX = 600;
/** Extra scrolling needed before it may come back after hiding itself. */
const REAPPEAR_AFTER_PX = 900;
/** Cap per page view — it advertises, it does not nag. */
const MAX_APPEARANCES = 3;

/**
 * The advert that closes over the article.
 *
 * A slim, clearly-labelled bar that slides up over the bottom of the viewport
 * once the reader is properly into the story — never while the headline and
 * lead image are still on screen, so the opening of the article always reads
 * clean. It only lasts a few seconds: a thin countdown line under the bar shows
 * the time left, hovering or focusing it pauses the countdown, and it slides
 * away by itself when the time is up so the reader is left alone with the
 * story. Anyone who wants it gone sooner taps the ✕, which cancels the advert
 * for the rest of the session (sessionStorage, so a new visit starts fresh).
 *
 * It also steps aside as soon as the comment section comes into view, so it
 * never covers the discussion at the foot of the article.
 *
 * After it has shown itself and gone once, it only returns if the reader has
 * carried on scrolling a good way further — at most three appearances per page
 * view, and never again in the session once the ✕ has been used.
 */
export default function StickyAdBar({ advertiser }: { advertiser: Advertiser }) {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  /** Bumped on every appearance so the countdown line restarts with it. */
  const [showCount, setShowCount] = useState(0);

  const visibleRef = useRef(false);
  const closedRef = useRef(false); // ✕ pressed — never show again this session
  const appearances = useRef(0);
  const anchorY = useRef(0); // scroll position of the last appearance
  const deadline = useRef(0); // when the current appearance runs out
  const remaining = useRef(AUTO_HIDE_MS);

  const show = useCallback(() => {
    visibleRef.current = true;
    remaining.current = AUTO_HIDE_MS;
    deadline.current = Date.now() + AUTO_HIDE_MS;
    setPaused(false);
    setShowCount((count) => count + 1);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    visibleRef.current = false;
    setPaused(false);
    setVisible(false);
  }, []);

  // Decide when the bar is allowed on screen.
  useEffect(() => {
    const key = `${CLOSED_KEY}:${advertiser._id}`;
    try {
      closedRef.current = sessionStorage.getItem(key) === '1';
    } catch {
      // Storage unavailable (private mode) — treat as not dismissed.
      closedRef.current = false;
    }

    const comments = document.getElementById('comments');

    const onScroll = () => {
      if (closedRef.current) return;
      const y = window.scrollY;
      const remainingScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = remainingScroll > 0 ? y / remainingScroll : 0;

      // Out of the way once the discussion at the foot of the story arrives.
      const reachedDiscussion =
        !!comments && comments.getBoundingClientRect().top < window.innerHeight - 80;
      if (reachedDiscussion) {
        if (visibleRef.current) hide();
        return;
      }

      const intoStory = y > START_AFTER_PX || progress > 0.12;
      if (!intoStory || visibleRef.current) return;
      if (appearances.current >= MAX_APPEARANCES) return;
      if (appearances.current > 0 && y - anchorY.current < REAPPEAR_AFTER_PX) return;

      appearances.current += 1;
      anchorY.current = y;
      show();
    };

    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [advertiser._id, show, hide]);

  // The few seconds are up — slide away.
  useEffect(() => {
    if (!visible || paused) return;
    const id = setTimeout(hide, Math.max(0, deadline.current - Date.now()));
    return () => clearTimeout(id);
  }, [visible, paused, hide]);

  // Reading the advert (hover / keyboard focus) holds it open, and so does
  // switching tabs — nobody loses their few seconds to a hidden window.
  const pause = useCallback(() => {
    if (!visibleRef.current) return;
    remaining.current = Math.max(0, deadline.current - Date.now());
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!visibleRef.current) return;
    deadline.current = Date.now() + remaining.current;
    setPaused(false);
  }, []);

  useEffect(() => {
    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [pause, resume]);

  const close = () => {
    try {
      sessionStorage.setItem(`${CLOSED_KEY}:${advertiser._id}`, '1');
    } catch {
      // Nothing to persist to; the bar still closes for this page view.
    }
    closedRef.current = true;
    hide();
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 ${
        visible ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-8 opacity-0'
      }`}
    >
      <aside
        aria-label="Advertisement"
        data-ad-placement="article-overlay"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-sm border border-border-strong bg-white shadow-[0_12px_36px_rgba(7,44,60,0.24)]"
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

        {/* Time left before the bar closes itself. */}
        <div className="h-[3px] w-full bg-surface-sunken" aria-hidden="true">
          <div
            key={showCount}
            className="en-ad-countdown h-full w-full bg-brand-secondary"
            data-paused={paused ? 'true' : 'false'}
            style={{ ['--ad-duration' as string]: `${AUTO_HIDE_MS}ms` }}
          />
        </div>
      </aside>
    </div>
  );
}
