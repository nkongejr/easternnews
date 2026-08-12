// src/app/contact/ContactForm.tsx
'use client';

import { useState } from 'react';
import { sendContactMessage, subscribeNewsletter } from '@/lib/api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sent'>('idle');

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
    await subscribeNewsletter(newsletterEmail);
    setSubStatus('sent');
    setNewsletterEmail('');
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input required type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border rounded px-3 py-2" />
        <textarea required placeholder="Your message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border rounded px-3 py-2" />
        <button disabled={status === 'sending'} className="bg-brand-blue text-white px-6 py-2 rounded font-semibold">
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'sent' && <p className="text-green-600 text-sm">Message sent — thank you!</p>}
        {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. Try again.</p>}
      </form>

      <div className="mt-10 border-t pt-6">
        <h2 className="font-bold mb-2">Subscribe to our Newsletter</h2>
        <form onSubmit={onSubscribe} className="flex gap-2">
          <input required type="email" placeholder="you@example.com" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="flex-1 border rounded px-3 py-2" />
          <button className="bg-brand-gold text-brand-blue-dark px-4 py-2 rounded font-bold">Subscribe</button>
        </form>
        {subStatus === 'sent' && <p className="text-green-600 text-sm mt-2">Subscribed!</p>}
      </div>
    </>
  );
}