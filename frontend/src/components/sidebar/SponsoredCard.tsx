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
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          Advertisement
        </p>
      )}

      <div className="flex items-center gap-3">
        {advertiser.logo && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-white">
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
          <p className="truncate font-headline text-[15px] font-bold text-ink">
            {advertiser.businessName}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-muted">{advertiser.category}</p>
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
          className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wider text-brand-blue hover:underline"
        >
          Learn more →
        </Link>
      )}
    </aside>
  );
}
