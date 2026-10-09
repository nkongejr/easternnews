// Behaviour tests for the rotating floating advert overlay: timing, dismissal,
// one-at-a-time display and timer cleanup.
//
// Run from `frontend/`:  npx vitest run   (or `npm test`, which also runs the
// engine suite in floating-ads.test.mjs)

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FloatingAdRotator from '@/components/articles/FloatingAdRotator';
import type { FloatingAd, FloatingAdTiming } from '@/lib/floatingAds';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test stub for next/image
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const ads: FloatingAd[] = [
  {
    id: 'a',
    headline: 'First Ad',
    advertiserName: 'A Ltd',
    description: 'First description',
    href: 'https://a.example',
    ctaLabel: 'Visit A',
    active: true,
  },
  {
    id: 'b',
    headline: 'Second Ad',
    description: 'Second description',
    href: 'https://b.example',
    active: true,
  },
  {
    id: 'c',
    headline: 'Third Ad',
    image: '/promo.png',
    href: '/internal',
    ctaLabel: 'Read more',
    active: true,
  },
];

/** Deterministic timing: 5s until the first advert, 25s between adverts. */
const TIMING: FloatingAdTiming = { initialDelayMs: 5000, nextAdDelayMs: 25000 };

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

/**
 * Track every `window.setTimeout` the component arms, dropping ids once they
 * fire or are cleared. jsdom's own internals (e.g. focus events) schedule
 * `setImmediate` jobs that inflate `vi.getTimerCount()`, so this only counts
 * the timers the overlay itself created.
 */
function trackComponentTimers() {
  const pending = new Set<unknown>();
  const originalSet = window.setTimeout.bind(window);
  const originalClear = window.clearTimeout.bind(window);
  window.setTimeout = ((
    fn: TimerHandler,
    ms?: number,
    ...args: unknown[]
  ) => {
    let id: unknown = undefined;
    const wrapped = (...callArgs: unknown[]) => {
      pending.delete(id);
      return (fn as (...a: unknown[]) => unknown)(...callArgs);
    };
    id = originalSet(wrapped as () => void, ms, ...(args as []));
    pending.add(id);
    return id;
  }) as typeof setTimeout;
  window.clearTimeout = ((id?: number) => {
    pending.delete(id);
    return originalClear(id);
  }) as typeof clearTimeout;

  return {
    pending: () => pending.size,
    restore: () => {
      window.setTimeout = originalSet;
      window.clearTimeout = originalClear;
    },
  };
}

const dialog = () => screen.queryByRole('dialog');
const expectAdvert = (headline: string) => {
  expect(dialog()).not.toBeNull();
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: headline })).toBeTruthy();
};
const expectNoAdvert = () => {
  expect(screen.queryByRole('dialog')).toBeNull();
};
const closeAdvert = () => fireEvent.click(screen.getByRole('button', { name: /close advertisement/i }));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe('FloatingAdRotator', () => {
  it('shows the first advert after the initial delay — not before', () => {
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    expectNoAdvert();

    advance(4999);
    expectNoAdvert();

    advance(1);
    expectAdvert('First Ad');
  });

  it('closing removes the advert at once and schedules the next after the interval', () => {
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');

    closeAdvert();
    expectNoAdvert();

    // Not replaced immediately — the reader keeps reading for the interval.
    advance(24999);
    expectNoAdvert();

    advance(1);
    expectAdvert('Second Ad');
  });

  it('rotates through every advert once, never two at a time, then stops', () => {
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);

    advance(5000);
    expectAdvert('First Ad');
    closeAdvert();

    advance(25000);
    expectAdvert('Second Ad');
    closeAdvert();

    advance(25000);
    expectAdvert('Third Ad');
    closeAdvert();

    // The pass is complete — no further adverts until a new visit cycles back.
    advance(25000);
    expectNoAdvert();
    advance(120000);
    expectNoAdvert();
  });

  it('skips inactive adverts entirely', () => {
    const withInactive = [
      ads[0],
      { ...ads[1], active: false },
      ads[2],
    ];
    render(<FloatingAdRotator ads={withInactive} timing={TIMING} />);

    advance(5000);
    expectAdvert('First Ad');
    closeAdvert();

    advance(25000);
    expectAdvert('Third Ad');
    expect(screen.queryByRole('heading', { name: 'Second Ad' })).toBeNull();
  });

  it('displays a single active advert without errors', () => {
    render(<FloatingAdRotator ads={[ads[0]]} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');
    closeAdvert();
    advance(60000);
    expectNoAdvert();
  });

  it('renders nothing when there are no active adverts', () => {
    render(<FloatingAdRotator ads={[]} timing={TIMING} />);
    advance(60000);
    expectNoAdvert();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('supports keyboard dismissal with Escape and never redirects', () => {
    const before = window.location.href;
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');

    fireEvent.keyDown(document, { key: 'Escape' });
    expectNoAdvert();
    // Closing must not navigate or reload.
    expect(window.location.href).toBe(before);

    advance(25000);
    expectAdvert('Second Ad');
  });

  it('clicking the advert links to its destination (new tab for external)', () => {
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);

    const link = screen.getByRole('link', { name: /First Ad/ });
    expect(link.getAttribute('href')).toBe('https://a.example');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('sponsored');
    expect(screen.getByText('Visit A').closest('a')?.getAttribute('href')).toBe('https://a.example');

    closeAdvert();
    advance(25000);
    const internal = screen.getByRole('link', { name: /Second Ad/ });
    expect(internal.getAttribute('href')).toBe('https://b.example');
  });

  it('keeps the close control visible and labelled', () => {
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expect(screen.getByRole('button', { name: 'Close advertisement' })).toBeTruthy();
  });

  it('cancels all pending display timers on unmount', () => {
    const tracked = trackComponentTimers();
    try {
      const { unmount } = render(<FloatingAdRotator ads={ads} timing={TIMING} />);
      advance(5000);
      closeAdvert(); // arms the next-advert timer
      expect(tracked.pending()).toBeGreaterThan(0);

      unmount();
      expect(tracked.pending()).toBe(0);
    } finally {
      tracked.restore();
    }
  });

  it('cancels the initial timer when the reader leaves before the first advert', () => {
    const tracked = trackComponentTimers();
    try {
      const { unmount } = render(<FloatingAdRotator ads={ads} timing={TIMING} />);
      expect(tracked.pending()).toBeGreaterThan(0);
      unmount();
      expect(tracked.pending()).toBe(0);
    } finally {
      tracked.restore();
    }
  });

  it('never reopens a dismissed advert during the same visit', () => {
    render(<FloatingAdRotator ads={[ads[0]]} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');
    closeAdvert();

    // Plenty of time passes — the closed advert must not come back this visit.
    advance(25000 * 4);
    expectNoAdvert();
  });

  it('persists dismissals across article visits within the session', () => {
    const firstVisit = render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');
    closeAdvert();
    firstVisit.unmount();

    // Navigating to another article — a fresh visit, same browsing session.
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expectAdvert('Second Ad');
    expect(screen.queryByRole('heading', { name: 'First Ad' })).toBeNull();
  });

  it('cycling back only after every advert was dismissed — on a new visit', () => {
    // Visit 1: dismiss all three adverts in one long sitting.
    const visit1 = render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    closeAdvert();
    advance(25000);
    closeAdvert();
    advance(25000);
    closeAdvert();
    advance(25000);
    expectNoAdvert();
    visit1.unmount();

    // Visit 2: the rotation has cycled — adverts may run again, in order.
    render(<FloatingAdRotator ads={ads} timing={TIMING} />);
    advance(5000);
    expectAdvert('First Ad');
  });
});
