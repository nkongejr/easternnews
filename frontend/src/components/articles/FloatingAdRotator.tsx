'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  DEFAULT_FLOATING_AD_TIMING,
  isExternalHref,
  resolveAdDelay,
  type FloatingAd,
  type FloatingAdTiming,
} from '@/lib/floatingAds';
import {
  createRotationState,
  createVisitState,
  loadRotationState,
  markDismissed,
  pickNextAd,
  saveRotationState,
  type AdStorageLike,
  type FloatingAdRotationState,
  type FloatingAdVisitState,
} from '@/lib/adRotation';

type Props = {
  /** The rotation's advert list (already filtered to active adverts). */
  ads: FloatingAd[];
  /** Initial delay and interval between adverts — configurable per render. */
  timing?: FloatingAdTiming;
};

/** sessionStorage access can throw in locked-down browsers — never let it. */
function getStorage(): AdStorageLike | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * The rotating floating advertisement shown over news articles.
 *
 * One advert at a time appears in a centred floating card over a soft
 * backdrop — the first after `timing.initialDelayMs` (default ~5s), then each
 * next eligible advert `timing.nextAdDelayMs` (default 20–30s) after the
 * previous one is closed. Closing never redirects or reloads: the ✕ simply
 * removes the card and arms the next timer. An advert the reader has closed is
 * not reopened during the same article visit, and dismissal/rotation progress
 * is kept in sessionStorage so moving between articles does not restart the
 * same advert at the reader again.
 *
 * Rotation rules (picking, fairness, session state) live in `adRotation` —
 * this component owns only display, timers and accessibility. All timers are
 * cancelled on unmount, so navigating away mid-wait leaves nothing behind.
 */
export default function FloatingAdRotator({ ads, timing = DEFAULT_FLOATING_AD_TIMING }: Props) {
  const [current, setCurrent] = useState<FloatingAd | null>(null);
  const titleId = useId();

  // The list and timing are supplied once by the server and never change
  // mid-page; refs keep them safely readable from timer callbacks.
  const adsRef = useRef(ads);
  const timingRef = useRef(timing);
  const currentRef = useRef<FloatingAd | null>(null);
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef<FloatingAdRotationState>(createRotationState());
  const visitRef = useRef<FloatingAdVisitState>(createVisitState());
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Pick the next eligible advert and put it on screen — at most one. */
  const showNext = useCallback(() => {
    timerRef.current = null;
    const list = adsRef.current;
    if (list.length === 0) return;

    const { ad, state } = pickNextAd(list, stateRef.current, visitRef.current);
    stateRef.current = state;
    saveRotationState(getStorage(), state);
    if (!ad) return;

    visitRef.current = {
      shown: [...visitRef.current.shown, ad.id],
      dismissed: visitRef.current.dismissed,
    };
    currentRef.current = ad;
    setCurrent(ad);
  }, []);

  /** Arm the single pending display timer (any previous one is cancelled). */
  const schedule = useCallback(
    (delayMs: number) => {
      clearTimer();
      if (adsRef.current.length === 0) return;
      timerRef.current = window.setTimeout(showNext, Math.max(0, delayMs));
    },
    [clearTimer, showNext],
  );

  /**
   * Close the current advert. The next advert is scheduled for the configured
   * interval — closing never immediately swaps in a replacement.
   */
  const dismiss = useCallback(() => {
    const ad = currentRef.current;
    clearTimer();
    if (ad) {
      const dismissed = Array.from(new Set([...visitRef.current.dismissed, ad.id]));
      visitRef.current = { shown: visitRef.current.shown, dismissed };
      stateRef.current = markDismissed(stateRef.current, ad.id);
      saveRotationState(getStorage(), stateRef.current);
    }
    currentRef.current = null;
    setCurrent(null);
    schedule(resolveAdDelay(timingRef.current.nextAdDelayMs));
  }, [clearTimer, schedule]);

  // Start the rotation when the article opens; cancel everything on unmount
  // (readers navigating away must leave no timer behind).
  useEffect(() => {
    stateRef.current = loadRotationState(getStorage());
    visitRef.current = createVisitState();
    schedule(timingRef.current.initialDelayMs);
    return () => {
      clearTimer();
    };
  }, [clearTimer, schedule]);

  // While an advert is open: Escape closes it, Tab is kept inside the card,
  // and focus moves to the close button. Closing hands focus back where it was.
  useEffect(() => {
    if (!current) return undefined;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== 'Tab') return;

      const card = cardRef.current;
      if (!card) return;
      const focusables = Array.from(
        card.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || !card.contains(activeEl))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeEl === last || !card.contains(activeEl))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const restore = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (restore && restore.isConnected) restore.focus();
    };
  }, [current, dismiss]);

  if (!current) return null;

  const ad = current;
  const external = Boolean(ad.href && isExternalHref(ad.href));
  const linkProps = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer nofollow sponsored' }
    : {};

  const body = (
    <>
      {ad.image && (
        <div className="relative aspect-[16/9] w-full bg-surface-sunken">
          <Image
            src={ad.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-contain"
          />
        </div>
      )}

      <div className="px-4 pb-4 pt-3.5 sm:px-5">
        <h2
          id={titleId}
          className="font-headline text-lg font-bold leading-snug text-ink sm:text-xl"
        >
          {ad.headline}
        </h2>
        {ad.advertiserName && (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {ad.advertiserName}
          </p>
        )}
        {ad.description && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{ad.description}</p>
        )}
        {ad.href && ad.ctaLabel && (
          <span className="mt-3.5 inline-block rounded-sm bg-brand-primary px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors group-hover:bg-brand-primary-dark">
            {ad.ctaLabel}
          </span>
        )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      {/* Soft backdrop — clicking it (not the card) closes the advert. */}
      <div
        aria-hidden="true"
        onClick={dismiss}
        className="en-fade-in absolute inset-0 bg-brand-primary-darker/45"
      />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-ad-placement="article-overlay"
        data-ad-id={ad.id}
        onClick={(event) => event.stopPropagation()}
        className="en-float-ad-in pointer-events-auto relative w-full max-w-md overflow-hidden rounded-sm border border-border-strong bg-white shadow-[0_24px_64px_rgba(7,44,60,0.32)]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
            Advertisement
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={dismiss}
            aria-label="Close advertisement"
            title="Close advertisement"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-alt hover:text-ink"
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

        {ad.href ? (
          <a
            href={ad.href}
            {...linkProps}
            className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </div>
  );
}
