import Breadcrumbs, { type Crumb } from './Breadcrumbs';

/**
 * Shared masthead for every non-article page (category, county, static).
 * One title treatment everywhere keeps the paper visually consistent:
 * a gray folio band, the section name set large and black in the display
 * serif, and the desk's own colour carried as a short rule underneath —
 * the way a printed section front is headed.
 */
export default function PageHeader({
  title,
  description,
  crumbs,
  accent,
  aside,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  accent?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="border-b-2 border-brand-navy bg-surface-alt">
      <div className="en-container py-7 md:py-10">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="font-headline text-[34px] font-black uppercase leading-[1.03] tracking-[-0.015em] text-headline sm:text-[42px] md:text-[46px]">
              {title}
            </h1>

            {/* Desk rule — the section's colour, short and heavy. */}
            <span
              aria-hidden="true"
              className="mt-4 block h-[4px] w-24"
              style={{ backgroundColor: accent || 'var(--brand-primary)' }}
            />

            {description && (
              <p className="mt-4 max-w-2xl font-read text-[15px] leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
          {aside}
        </div>
      </div>
    </div>
  );
}
