import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Editorial' };

export default async function EditorialPage({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <CategoryArchivePage
      categoryName="Editorial"
      baseHref="/editorial"
      page={Number(searchParams.page || 1)}
    />
  );
}