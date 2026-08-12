import Image from 'next/image';
import Link from 'next/link';
import { Advertiser } from '@/types';

export default function SponsoredCard({ advertiser }: { advertiser: Advertiser }) {
  return (
    <div className="border-2 border-brand-gold rounded-lg p-4 bg-yellow-50">
      <span className="text-[10px] font-bold uppercase tracking-wide text-brand-gold-dark bg-white px-2 py-0.5 rounded">
        Sponsored Content
      </span>
      <div className="flex items-center gap-3 mt-2">
        {advertiser.logo && (
          <div className="relative w-12 h-12 shrink-0">
            <Image src={advertiser.logo} alt={advertiser.businessName} fill className="object-contain" />
          </div>
        )}
        <div>
          <p className="font-bold text-sm">{advertiser.businessName}</p>
          <p className="text-xs text-gray-500">{advertiser.category}</p>
        </div>
      </div>
      <p className="text-xs text-gray-700 mt-2 line-clamp-3">{advertiser.description}</p>
      {advertiser.linkURL && (
        <Link href={advertiser.linkURL} target="_blank" className="text-xs font-semibold text-brand-blue hover:underline mt-2 inline-block">
          Learn more →
        </Link>
      )}
    </div>
  );
}