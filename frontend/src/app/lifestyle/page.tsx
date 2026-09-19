import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/lifestyle' },
  title: 'Lifestyle',
  description: 'Lifestyle coverage from The Eastern Newspaper.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function LifestylePage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Lifestyle"
      description="Lifestyle stories from across the Eastern region."
      baseHref="/lifestyle"
      page={Number(page || 1)}
      category="Lifestyle"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Lifestyle' }]}
    />
  );
}
