'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';
import SidebarWidget from './SidebarWidget';

/** Wires the existing /contact/newsletter endpoint into the front page rail. */
export default function NewsletterWidget() {
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
    <SidebarWidget
      title="Newsletter"
      subtitle="The month's best reporting, in your inbox"
      accent="var(--color-brand-gold-dark)"
    >
      <form onSubmit={onSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-sm border border-border bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-2 h-11 w-full rounded-sm bg-brand-blue text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
        </button>
        <p aria-live="polite" className="mt-2 min-h-4 text-[11px]">
          {status === 'sent' && <span className="text-green-700">Thank you — you’re subscribed.</span>}
          {status === 'error' && <span className="text-accent">Something went wrong. Try again.</span>}
        </p>
      </form>
    </SidebarWidget>
  );
}
