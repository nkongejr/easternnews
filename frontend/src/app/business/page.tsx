import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = {
  alternates: { canonical: '/business' }, title: 'Business News' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BusinessPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <CategoryArchivePage
      categoryName="Business"
      baseHref="/business"
      page={Number(page || 1)}
      description="Business and economy across the Eastern region."
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Business News' }]}
    />
  );
}
