import SectionHeader from '@/components/shared/SectionHeader';
import NewsGrid from './NewsGrid';
import { Article } from '@/types';

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles?.length) return null;

  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <SectionHeader title="Related Stories" accent="var(--color-ink)" />
      <div id="related-heading">
        <NewsGrid articles={articles} columns={3} />
      </div>
    </section>
  );
}
