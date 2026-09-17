import Breadcrumbs, { type Crumb } from './Breadcrumbs';

/**
 * Shared masthead for every non-article page (category, county, static).
 * One title treatment everywhere keeps the paper visually consistent.
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
    <div className="border-b border-border bg-surface-alt">
      <div className="en-container py-6 md:py-8">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="border-b-4 border-brand-gold pb-2 font-headline text-3xl font-black uppercase leading-none tracking-tight md:text-4xl"
              style={{ color: accent || 'var(--color-ink)' }}
            >
              {title}
            </h1>
            {description && <p className="mt-3 text-sm text-muted">{description}</p>}
          </div>
          {aside}
        </div>
      </div>
    </div>
  );
}
