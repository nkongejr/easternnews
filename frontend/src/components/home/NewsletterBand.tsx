'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';
import { SITE } from '@/lib/constants';

/**
 * Reader-engagement band. Sits above the footer and posts to the existing
 * POST /api/contact/newsletter endpoint.
 */
export default function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await subscribeNewsletter(email);
      setStatus('sent');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      aria-labelledby="newsletter-band"
      className="border-y-2 border-brand-navy bg-brand-navy text-white"
    >
      <div className="en-container grid items-center gap-6 py-10 md:grid-cols-2 md:gap-10 md:py-12">
        <div>
          <p className="en-kicker mb-2.5 text-brand-cyan">Newsletter</p>
          <h2
            id="newsletter-band"
            className="font-headline text-[26px] font-black leading-[1.15] tracking-[-0.02em] text-white md:text-[34px]"
          >
            Stay informed. Get the latest Eastern Kenya news delivered to your inbox.
          </h2>
          <p className="mt-3 max-w-lg font-read text-[14px] leading-relaxed text-white/75">
            The month’s most important reporting from {SITE.name}, across all eleven
            county desks. No spam, and you can unsubscribe at any time.
          </p>
        </div>

        <div>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-band-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-band-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full flex-1 border-0 px-4 text-sm text-text placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-cyan"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="en-btn h-12 shrink-0 bg-brand-secondary px-7 text-[13px] text-brand-navy transition-colors hover:bg-brand-secondary-dark disabled:opacity-60"
            >
              {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          <p aria-live="polite" className="mt-3 min-h-5 text-[12px]">
            {status === 'sent' && (
              <span className="font-semibold text-brand-cyan">Thank you — you’re subscribed.</span>
            )}
            {status === 'error' && (
              <span className="text-white/80">Something went wrong. Please try again.</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
