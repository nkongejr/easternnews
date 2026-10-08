import Image from 'next/image';
import Link from 'next/link';
import { Advertiser } from '@/types';

/**
 * Sponsored module. Visually separated from editorial content by a dashed
 * frame, a neutral tint and an explicit "Advertisement" label — readers can
 * never mistake it for news, and the page stays uncluttered.
 */
export default function SponsoredCard({
  advertiser,
  showLabel = true,
}: {
  advertiser: Advertiser;
  showLabel?: boolean;
}) {
  return (
    <aside className="border border-dashed border-border-strong bg-surface-alt p-4">
      {showLabel && (
        <p className="mb-2.5 inline-block bg-brand-secondary px-2 py-1 font-condensed text-[10px] font-black uppercase tracking-[0.18em] text-brand-navy">
          Sponsored Content
        </p>
      )}

      <div className="flex items-center gap-3">
        {advertiser.logo && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-white">
            <Image
              src={advertiser.logo}
              alt={`${advertiser.businessName} logo`}
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-headline text-[16px] font-bold text-headline">
            {advertiser.businessName}
          </p>
          <p className="font-condensed text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">{advertiser.category}</p>
        </div>
      </div>

      {advertiser.description && (
        <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-muted">
          {advertiser.description}
        </p>
      )}

      {advertiser.contact?.phone && (
        <p className="mt-2 text-[13px] font-semibold text-ink">{advertiser.contact.phone}</p>
      )}

      {advertiser.linkURL && (
        <Link
          href={advertiser.linkURL}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="en-btn mt-3 inline-block bg-brand-navy px-3 py-2 text-[11px] text-white transition-colors hover:bg-brand-primary"
        >
          Learn more →
        </Link>
      )}
    </aside>
  );
}
