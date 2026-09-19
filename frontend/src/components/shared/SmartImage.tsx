'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import ImageFallback from './ImageFallback';

type Props = Omit<ImageProps, 'src' | 'alt' | 'fill' | 'onError'> & {
  src?: string | null;
  alt: string;
  imgClassName?: string;
};

/**
 * next/image wrapper that degrades to a branded placeholder instead of a
 * broken tile when a CMS image is missing or the remote host fails.
 * The aspect-ratio frame is always rendered, so card grids stay aligned.
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

  if (!src || failed) {
    return <ImageFallback alt={alt} />;
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`${imgClassName} ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
