import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/entertainment' },
  title: 'Entertainment',
  description: 'Entertainment coverage from The Eastern Newspaper.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function EntertainmentPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Entertainment"
      description="Entertainment stories from across the Eastern region."
      baseHref="/entertainment"
      page={Number(page || 1)}
      category="Entertainment"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Entertainment' }]}
    />
  );
}
