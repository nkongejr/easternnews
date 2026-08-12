import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Opinion' };

export default async function OpinionPage({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <CategoryArchivePage
      categoryName="Opinion"
      baseHref="/opinion"
      page={Number(searchParams.page || 1)}
    />
  );
}