import Image from 'next/image';
import Link from 'next/link';
import { api, safe } from '@/lib/api';

/**
 * Boxed advert that runs *inside* the story body (CMS placement
 * `article-inline`). It is a plain block in the reading column — no takeover,
 * no movement — but it sits between paragraphs, so a reader scrolling the
 * article meets it where they are already looking. Clearly labelled and
 * visually fenced off from editorial copy.
 *
 * Renders nothing when no advertiser is booked for the slot.
 */
export default async function ArticleInlineAd() {
  const advertisers = await safe(api.getAdvertisers({ placement: 'article-inline' }), []);
  const ad = advertisers[0];
  if (!ad) return null;

  const inner = (
    <>
      {ad.logo && (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-border">
          <Image
            src={ad.logo}
            alt={`${ad.businessName} logo`}
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-headline text-[15px] font-bold leading-snug text-ink">
          {ad.businessName}
        </p>
        <p className="text-[11px] uppercase tracking-wide text-muted">{ad.category}</p>
      </div>
    </>
  );

  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement="article-inline"
      className="my-8 border border-dashed border-border-strong bg-surface-alt p-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Advertisement</p>

      {ad.linkURL ? (
        <Link
          href={ad.linkURL}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="mt-3 flex items-center gap-3"
        >
          {inner}
        </Link>
      ) : (
        <div className="mt-3 flex items-center gap-3">{inner}</div>
      )}

      {ad.description && (
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{ad.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {ad.contact?.phone && (
          <p className="text-[13px] font-semibold text-ink">{ad.contact.phone}</p>
        )}
        {ad.linkURL && (
          <Link
            href={ad.linkURL}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="text-[11px] font-bold uppercase tracking-wider text-brand-blue hover:underline"
          >
            Visit website →
          </Link>
        )}
      </div>
    </aside>
  );
}
