import Image from 'next/image';
import { SITE } from '@/lib/constants';

/**
 * Eastern Newspaper wordmark — the official logo from
 * “EASTERN NEWSPAPER LOGO 1.jpg” (trimmed of its white surround).
 *
 * Used in the masthead, sticky nav and footer so the brand never
 * drifts between surfaces. The file already contains the “Be in the
 * Know” tagline, so `showTagline` is kept only for API compatibility
 * and renders nothing extra.
 *
 * The logo is a JPG on a white ground, so on dark bars (`inverse`)
 * it sits on a small white pill instead of floating as a raw box.
 */
export default function Wordmark({
  size = 'md',
  inverse = false,
  showTagline = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  inverse?: boolean;
  showTagline?: boolean;
}) {
  void showTagline;

  const heightClass =
    size === 'lg'
      ? 'h-12 md:h-14'
      : size === 'sm'
        ? 'h-8'
        : 'h-10';

  const img = (
    <Image
      src={SITE.logo}
      alt={`${SITE.name} logo — ${SITE.tagline}`}
      width={621}
      height={295}
      priority={size === 'lg'}
      className={`${heightClass} w-auto max-w-full object-contain`}
    />
  );

  if (inverse) {
    return (
      <span className="inline-flex items-center rounded-sm bg-white px-2 py-1">
        {img}
      </span>
    );
  }

  return <span className="inline-flex min-w-0 items-center">{img}</span>;
}
