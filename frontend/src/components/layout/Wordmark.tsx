import Image from 'next/image';
import { SITE } from '@/lib/constants';

/**
 * Eastern Newspaper wordmark — the official logo from
 * “EASTERN NEWSPAPER LOGO 1.jpg” (trimmed of its white surround).
 *
 * Used in the masthead, the mobile drawer and the footer so the brand
 * never drifts between surfaces. The file already contains the “Be in
 * the Know” tagline, so `showTagline` is kept only for API compatibility
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

  /**
   * `lg` is the masthead. On phones the mark stretches across the whole
   * header so no dead space is left beside it (the header holds nothing
   * else until md, where the live search field appears); from md up it
   * goes back to a fixed height so search keeps its room.
   */
  const sizing =
    size === 'lg'
      ? 'h-auto w-full max-w-full md:h-14 md:w-auto'
      : size === 'sm'
        ? 'h-8 w-auto'
        : 'h-10 w-auto';

  const img = (
    <Image
      src={SITE.logo}
      alt={`${SITE.name} logo — ${SITE.tagline}`}
      width={621}
      height={295}
      priority={size === 'lg'}
      className={`${sizing} object-contain`}
    />
  );

  if (inverse) {
    return (
      <span className="inline-flex items-center rounded-sm bg-white px-2 py-1">
        {img}
      </span>
    );
  }

  /**
   * The masthead wrapper mirrors the image sizing — it must be the full
   * header width on phones or there is nothing for `w-full` to span.
   */
  const wrapperClass =
    size === 'lg'
      ? 'flex w-full min-w-0 items-center md:w-auto'
      : 'inline-flex min-w-0 items-center';

  return <span className={wrapperClass}>{img}</span>;
}
