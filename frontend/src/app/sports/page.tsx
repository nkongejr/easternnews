import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Sports News' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function SportsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <CategoryArchivePage
      categoryName="Sports"
      baseHref="/sports"
      page={Number(page || 1)}
    />
  );
}