import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/editorial' },
  title: 'Features & Editorial',
  description: 'Features, editorials and longer reads from The Eastern Newspaper.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function EditorialPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Features & Editorial"
      description="Features, editorials and the paper’s own voice."
      baseHref="/editorial"
      page={Number(page || 1)}
      category="Editorial"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Features & Editorial' }]}
    />
  );
}
