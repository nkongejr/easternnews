import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';

/**
 * Full-width leaderboard slot using the CMS `banner` placement. Clearly
 * labelled and neutrally framed so it reads as advertising, not editorial.
 * Renders nothing when no banner advertiser is active.
 */
export default async function AdBanner() {
  let advertisers: Awaited<ReturnType<typeof api.getAdvertisers>> = [];
  try {
    advertisers = await api.getAdvertisers({ placement: 'banner' });
  } catch {
    return null;
  }

  const ad = advertisers[0];
  if (!ad) return null;

  const body = (
    <div className="en-container flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-center sm:gap-6">
      {ad.logo && (
        <div className="relative h-14 w-32 shrink-0 overflow-hidden rounded-sm bg-white">
          <Image
            src={ad.logo}
            alt={`${ad.businessName} logo`}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
      )}
      <div className="text-center sm:text-left">
        <p className="font-headline text-lg font-bold text-ink">{ad.businessName}</p>
        {ad.description && (
          <p className="mt-0.5 line-clamp-2 max-w-2xl text-[13px] text-muted">{ad.description}</p>
        )}
        {ad.contact?.phone && (
          <p className="mt-1 text-[13px] font-semibold text-brand-blue">{ad.contact.phone}</p>
        )}
      </div>
    </div>
  );

  return (
    <section
      aria-label="Advertisement"
      className="border-y border-border bg-surface-alt"
      data-ad-placement="banner"
    >
      <p className="en-container pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        Advertisement
      </p>
      {ad.linkURL ? (
        <Link
          href={ad.linkURL}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="block transition-colors hover:bg-surface-sunken"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </section>
  );
}
