'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'src' | 'alt' | 'fill' | 'onError'> & {
  src?: string | null;
  alt: string;
  /** Extra classes for the <img>, e.g. object-position tweaks. */
  imgClassName?: string;
};

/**
 * next/image wrapper that degrades gracefully instead of rendering a broken
 * tile when a CMS image is missing or the remote host fails. Keeps card grids
 * aligned because the aspect-ratio frame is always rendered.
 */
export default function SmartImage({
  src,
  alt,
  sizes = '100vw',
  className = '',
  imgClassName = 'object-cover',
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <>
      {showFallback ? (
        <span className="en-imgfallback" role="img" aria-label={alt} />
      ) : (
        <Image
          {...rest}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`${imgClassName} ${className}`}
          onError={() => setFailed(true)}
        />
      )}
    </>
  );
}
