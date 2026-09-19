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
              className="inline-block bg-brand-primary px-3 py-2 font-headline text-2xl font-black uppercase leading-none tracking-tight text-white md:text-3xl"
              style={accent ? { backgroundColor: accent } : undefined}
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
