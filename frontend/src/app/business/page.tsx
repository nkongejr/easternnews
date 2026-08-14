import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Business News' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BusinessPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <CategoryArchivePage
      categoryName="Business"
      baseHref="/business"
      page={Number(page || 1)}
    />
  );
}