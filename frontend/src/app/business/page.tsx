import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Business News' };

export default async function BusinessPage({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <CategoryArchivePage
      categoryName="Business"
      baseHref="/business"
      page={Number(searchParams.page || 1)}
    />
  );
}