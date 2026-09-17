'use client';

import { useState } from 'react';
import { sendContactMessage, subscribeNewsletter } from '@/lib/api';

const inputCls =
  'w-full rounded-sm border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand-blue';
const labelCls = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContactMessage(form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('sending');
    try {
      await subscribeNewsletter(newsletterEmail);
      setSubStatus('sent');
      setNewsletterEmail('');
    } catch {
      setSubStatus('error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelCls}>
              Your name
            </label>
            <input
              id="contact-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelCls}>
              Your email
            </label>
            <input
              id="contact-email"
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelCls}>
            Subject
          </label>
          <input
            id="contact-subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelCls}>
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-sm bg-brand-blue px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>

        <p aria-live="polite" className="min-h-5 text-sm">
          {status === 'sent' && <span className="text-green-700">Message sent — thank you!</span>}
          {status === 'error' && <span className="text-accent">Something went wrong. Try again.</span>}
        </p>
      </form>

      <div className="mt-10 border-t-2 border-brand-gold pt-6">
        <h2 className="font-headline text-lg font-bold text-ink">Subscribe to our Newsletter</h2>
        <p className="mt-1 mb-3 text-sm text-muted">
          The month’s best reporting from the Eastern region, in your inbox.
        </p>
        <form onSubmit={onSubscribe} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            required
            type="email"
            placeholder="you@example.com"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className={`${inputCls} sm:flex-1`}
          />
          <button
            type="submit"
            disabled={subStatus === 'sending'}
            className="rounded-sm bg-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-blue-darker transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
          >
            {subStatus === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        <p aria-live="polite" className="min-h-5 pt-2 text-sm">
          {subStatus === 'sent' && <span className="text-green-700">Subscribed!</span>}
          {subStatus === 'error' && <span className="text-accent">Something went wrong.</span>}
        </p>
      </div>
    </>
  );
}
