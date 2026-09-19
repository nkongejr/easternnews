import { SITE } from '@/lib/constants';

/**
 * Eastern Newspaper wordmark. A compact “EN” monogram plus the two-colour
 * name — used in the masthead, sticky nav and footer so the brand never
 * drifts between surfaces.
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
  const mono =
    size === 'lg'
      ? 'h-12 w-12 text-base'
      : size === 'sm'
        ? 'h-8 w-8 text-[11px]'
        : 'h-10 w-10 text-sm';

  const name =
    size === 'lg'
      ? 'text-[22px] sm:text-[26px] md:text-[30px]'
      : size === 'sm'
        ? 'text-[13px]'
        : 'text-[17px] sm:text-[20px]';

  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center font-headline font-black ${mono} ${
          inverse ? 'bg-brand-secondary text-brand-primary-darker' : 'bg-brand-primary text-brand-secondary'
        }`}
      >
        EN
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`font-headline font-black tracking-tight ${name}`}>
          <span className={inverse ? 'text-white' : 'text-brand-primary'}>{SITE.wordmarkTop}</span>{' '}
          <span className={inverse ? 'text-brand-secondary' : 'text-brand-secondary'}>
            {SITE.wordmarkBottom}
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 font-headline text-[10px] italic sm:text-[11px] ${
              inverse ? 'text-white/70' : 'text-muted'
            }`}
          >
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
