import { SITE } from '@/lib/constants';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';

/**
 * Eastern Newspaper masthead lockup.
 *
 * When the supplied logo artwork is installed (see lib/logo.ts) it is
 * rendered here at its native proportions — the frame fixes only the
 * height, so the mark can never be stretched or squashed. Until then the
 * slot falls back to the typographic lockup: an "EN" monogram on the
 * logo's navy plus the two-colour name, so the masthead is never empty.
 *
 * Used in the masthead, sticky nav, drawer and footer so the brand never
 * drifts between surfaces.
 *
 * A plain <img> is deliberate: it keeps SVG artwork vector-crisp and does
 * not require the file to exist at build time.
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
  if (LOGO_SRC) {
    return (
      <span className="flex items-center gap-3">
        <span className={`en-logo-frame en-logo-frame--${size}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt={LOGO_ALT} className="en-logo" />
        </span>
        {showTagline && (
          <span
            className={`hidden border-l pl-3 font-condensed text-[10px] font-bold uppercase leading-tight tracking-[0.18em] sm:block ${
              inverse ? 'border-white/25 text-white/70' : 'border-border-strong text-muted'
            }`}
          >
            {SITE.tagline}
          </span>
        )}
      </span>
    );
  }

  const mono =
    size === 'lg'
      ? 'h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-lg'
      : size === 'sm'
        ? 'h-8 w-8 text-[11px]'
        : 'h-10 w-10 text-sm';

  const name =
    size === 'lg'
      ? 'text-[24px] sm:text-[30px] md:text-[36px]'
      : size === 'sm'
        ? 'text-[13px]'
        : 'text-[17px] sm:text-[20px]';

  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`relative flex shrink-0 items-center justify-center overflow-hidden font-headline font-black ${mono} ${
          inverse ? 'bg-brand-secondary text-brand-navy' : 'bg-brand-navy text-brand-secondary'
        }`}
      >
        EN
        {/* Cyan foot to the monogram — the third logo colour, kept small. */}
        <span
          className={`absolute inset-x-0 bottom-0 h-[3px] ${
            inverse ? 'bg-brand-navy' : 'bg-brand-cyan'
          }`}
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`font-headline font-black tracking-[-0.02em] ${name} ${
            inverse ? 'text-white' : 'text-headline'
          }`}
        >
          {SITE.wordmarkTop}{' '}
          <span className={inverse ? 'text-brand-cyan' : 'text-brand-primary'}>
            {SITE.wordmarkBottom}
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-1.5 font-condensed text-[10px] font-bold uppercase tracking-[0.22em] ${
              inverse ? 'text-white/65' : 'text-muted'
            }`}
          >
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
