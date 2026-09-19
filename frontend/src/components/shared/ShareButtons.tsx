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
      className: 'bg-brand-blue text-white hover:bg-brand-blue-dark',
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaXTwitter size={13} />,
      className: 'bg-ink text-white hover:bg-black',
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
            className={`inline-flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-90 ${l.className}`}
          >
            {l.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          className="inline-flex h-9 w-9 items-center justify-center border border-border text-muted transition-colors hover:border-brand-blue hover:text-brand-blue"
        >
          <FaLink size={13} />
        </button>
      </div>
    </div>
  );
}
