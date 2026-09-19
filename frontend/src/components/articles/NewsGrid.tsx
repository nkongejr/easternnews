import { Article } from '@/types';
import ArticleCard, { type CardVariant } from './ArticleCard';

const COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Standard article grid. Every grid in the site goes through this so column
 * counts and gutters can never drift between sections.
 */
export default function NewsGrid({
  articles,
  columns = 3,
  variant = 'default',
  showExcerpt = true,
  showComments = false,
  gap = 'gap-x-6 gap-y-8',
  className = '',
}: {
  articles: Article[];
  columns?: 1 | 2 | 3 | 4;
  variant?: CardVariant;
  showExcerpt?: boolean;
  showComments?: boolean;
  gap?: string;
  className?: string;
}) {
  if (!articles?.length) return null;

  return (
    <div className={`grid ${COLS[columns]} ${gap} ${className}`}>
      {articles.map((a, i) => (
        <ArticleCard
          key={a._id}
          article={a}
          variant={variant}
          showExcerpt={showExcerpt}
          showComments={showComments}
          priority={i === 0 && variant === 'featured'}
        />
      ))}
    </div>
  );
}

/**
 * Stacked list separated by hairlines — the side-rails next to a lead story.
 */
export function NewsList({
  articles,
  variant = 'compact',
  className = '',
}: {
  articles: Article[];
  variant?: CardVariant;
  className?: string;
}) {
  if (!articles?.length) return null;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a} variant={variant} />
      ))}
    </div>
  );
}
