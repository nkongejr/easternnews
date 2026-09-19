import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/politics' },
  title: 'Politics & Governance',
  description:
    'Factual, non-partisan coverage of politics, governance and public policy across Eastern Kenya.',
};

type Props = { searchParams: Promise<{ page?: string }> };

/**
 * Governance reporting is currently filed under the existing "National"
 * desk, so this section shows real stories from day one. If the newsroom
 * later adds a dedicated Politics category, change `category` below.
 */
export default async function PoliticsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Politics & Governance"
      description="County and national governance, policy and public finance."
      baseHref="/politics"
      page={Number(page || 1)}
      category="National"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Politics & Governance' }]}
    />
  );
}
