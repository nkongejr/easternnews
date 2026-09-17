'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchBar({
  onNavigate,
  className = '',
  placeholder = 'Search Eastern News…',
  autoFocus = false,
}: {
  /** Called after navigation so callers can close their own panel/drawer. */
  onNavigate?: () => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onNavigate?.();
  };

  return (
    <form onSubmit={onSubmit} role="search" className={`flex gap-2 ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search articles
      </label>
      <div className="relative flex-1">
        <FaMagnifyingGlass
          size={13}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id="site-search"
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-sm border border-border bg-white pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand-blue"
        />
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-sm bg-brand-gold px-5 text-xs font-bold uppercase tracking-wider text-brand-blue-darker transition-colors hover:bg-brand-gold-dark hover:text-white"
      >
        Search
      </button>
    </form>
  );
}
