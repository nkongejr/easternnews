import ArchivePage from './ArchivePage';
import type { Crumb } from '@/components/shared/Breadcrumbs';

/**
 * Thin wrapper keeping the category/county call sites unchanged while the
 * rendering lives in the shared ArchivePage template.
 */
export default async function CategoryArchivePage({
  categoryName,
  baseHref,
  page,
  description,
  crumbs,
}: {
  categoryName: string;
  baseHref: string;
  page: number;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <ArchivePage
      title={`${categoryName} News`}
      baseHref={baseHref}
      page={page}
      category={categoryName}
      description={description}
      crumbs={crumbs}
    />
  );
}
