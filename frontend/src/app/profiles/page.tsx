import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/profiles' },
  title: 'Eastern 33 Profiles',
  description:
    'Eastern 33 Profiles — leaders, innovators and achievers shaping the Eastern region.',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ProfilesPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Eastern 33 Profiles"
      description="Profiles of the leaders, innovators and achievers shaping the Eastern region."
      baseHref="/profiles"
      page={Number(page || 1)}
      category="Profiles"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Eastern 33 Profiles' }]}
    />
  );
}
