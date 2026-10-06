import ArchivePage from '@/components/category/ArchivePage';

export const metadata = {
  alternates: { canonical: '/profiles' },
  title: 'Eastern 33 Profiles',
  description:
    'Eastern 33 Profiles — the leaders, educationists, innovators and achievers shaping Eastern Kenya.',
};

type Props = { searchParams: Promise<{ page?: string }> };

/**
 * Eastern 33 Profiles.
 *
 * Profiles are filed through the normal article workflow under the
 * "Profiles" category, so the newsroom publishes them exactly the way it
 * publishes any other story.
 */
export default async function ProfilesPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <ArchivePage
      title="Eastern 33 Profiles"
      description="Leaders, educationists, innovators and achievers shaping Eastern Kenya."
      baseHref="/profiles"
      page={Number(page || 1)}
      category="Profiles"
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Eastern 33 Profiles' }]}
    />
  );
}
