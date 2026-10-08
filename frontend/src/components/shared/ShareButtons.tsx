'use client';

import { FaFacebookF, FaXTwitter, FaWhatsapp, FaLink } from 'react-icons/fa6';

export default function ShareButtons({
  title,
  url,
  compact = false,
}: {
  title: string;
  url: string;
  compact?: boolean;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
  };

  const links = [
    {
      label: 'Share on Facebook',
      href: `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF size={13} />,
      className: 'bg-brand-primary text-white hover:bg-brand-primary-dark',
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaXTwitter size={13} />,
      className: 'bg-brand-navy text-white hover:bg-brand-ink',
    },
    {
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <FaWhatsapp size={14} />,
      className: 'bg-[#25D366] text-white hover:brightness-95',
    },
  ];

  return (
    <div className={compact ? '' : 'mt-8 border-y border-border py-4'}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="en-kicker text-muted">Share</span>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            className={`inline-flex h-9 w-9 items-center justify-center transition-colors hover:opacity-90 ${l.className}`}
          >
            {l.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          className="inline-flex h-9 w-9 items-center justify-center border border-border-strong text-muted transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
        >
          <FaLink size={13} />
        </button>
      </div>
    </div>
  );
}
