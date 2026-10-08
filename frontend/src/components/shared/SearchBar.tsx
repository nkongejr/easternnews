'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchBar({
  onNavigate,
  className = '',
  placeholder = 'Search Eastern News…',
  autoFocus = false,
  inputId = 'site-search',
}: {
  /** Called after navigation so callers can close their own panel/drawer. */
  onNavigate?: () => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  inputId?: string;
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
      <label htmlFor={inputId} className="sr-only">
        Search articles
      </label>
      <div className="relative flex-1">
        <FaMagnifyingGlass
          size={13}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id={inputId}
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full border border-border-strong bg-white pl-9 pr-3 text-sm text-ink placeholder:text-muted transition-colors hover:border-brand-cyan-dark focus:border-brand-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="en-btn h-11 shrink-0 bg-brand-secondary px-5 text-[12px] text-brand-navy transition-colors hover:bg-brand-secondary-dark"
      >
        Search
      </button>
    </form>
  );
}
