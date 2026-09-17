import { FaRegClock, FaRegComment, FaRegEye } from 'react-icons/fa6';
import { Article } from '@/types';
import { formatDate, readingTime } from '@/lib/format';

/**
 * One metadata line, used identically on cards and article pages:
 * By <author> · <date> · [read time] · [comments] · [views]
 * Every optional fragment is omitted when the data is absent, so no card ever
 * renders an empty separator.
 */
export default function ArticleMeta({
  article,
  showAuthor = true,
  showReadTime = false,
  showComments = false,
  showViews = false,
  className = '',
}: {
  article: Article;
  showAuthor?: boolean;
  showReadTime?: boolean;
  showComments?: boolean;
  showViews?: boolean;
  className?: string;
}) {
  const date = formatDate(article.publishDate || article.createdAt);
  const mins = readingTime(article.body);
  const comments = article.commentCount ?? 0;
  const views = article.viewCount ?? 0;

  // `bylineCredit` is often the same string as the author name (e.g. "KNA"),
  // so only render it when it actually adds information.
  const authorName = article.author?.name || article.bylineCredit || 'Eastern Newspaper Team';
  const credit =
    article.bylineCredit && article.bylineCredit !== authorName ? article.bylineCredit : null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted ${className}`}
    >
      {showAuthor && (
        <span className="font-semibold text-ink/80">
          By {authorName}
          {credit ? ` · ${credit}` : ''}
        </span>
      )}
      {date && (
        <>
          {showAuthor && <span aria-hidden="true">·</span>}
          <time dateTime={article.publishDate || article.createdAt}>{date}</time>
        </>
      )}
      {showReadTime && (
        <span className="inline-flex items-center gap-1">
          <span aria-hidden="true">·</span>
          <FaRegClock size={10} aria-hidden="true" />
          {mins} min read
        </span>
      )}
      {showComments && comments > 0 && (
        <span className="inline-flex items-center gap-1">
          <span aria-hidden="true">·</span>
          <FaRegComment size={10} aria-hidden="true" />
          {comments} {comments === 1 ? 'comment' : 'comments'}
        </span>
      )}
      {showViews && views > 0 && (
        <span className="inline-flex items-center gap-1">
          <span aria-hidden="true">·</span>
          <FaRegEye size={10} aria-hidden="true" />
          {views.toLocaleString('en-GB')} views
        </span>
      )}
    </div>
  );
}
