import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Sports' };

export default async function SportsPage({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <CategoryArchivePage
      categoryName="Sports"
      baseHref="/sports"
      page={Number(searchParams.page || 1)}
    />
  );
}