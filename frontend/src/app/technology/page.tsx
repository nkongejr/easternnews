import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/technology' },
  title: 'Technology',
  description: 'Technology coverage from The Eastern Newspaper.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function TechnologyPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Technology"
      description="Technology stories from across the Eastern region."
      baseHref="/technology"
      page={Number(page || 1)}
      category="Technology"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Technology' }]}
    />
  );
}
