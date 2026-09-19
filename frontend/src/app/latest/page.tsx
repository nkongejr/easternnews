import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/latest' },
  title: 'Latest News',
  description:
    'The newest reporting from The Eastern Newspaper — Eastern Kenya and national news as it happens.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function LatestPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Latest News"
      description="Every story from the newsroom, newest first."
      baseHref="/latest"
      page={Number(page || 1)}
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Latest News' }]}
      limit={12}
    />
  );
}
