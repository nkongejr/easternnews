import { FaRegClock, FaRegComment, FaRegEye } from 'react-icons/fa6';
import { Article } from '@/types';
import { byline, formatDate, readingTime } from '@/lib/format';

/**
 * One metadata line, used identically on cards and article pages:
 * By <author> · <date> · [read time] · [comments] · [views]
 * Every optional fragment is omitted when the data is absent, so no card ever
 * renders an empty separator.
 *
 * The byline keeps its sentence case (names read better that way); the
 * mechanical fragments — date, read time, counts — go condensed and
 * uppercase, the way a printed folio line is set.
 */
const FOLIO = 'inline-flex items-center gap-1 font-condensed text-[10.5px] font-semibold uppercase tracking-[0.09em]';

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

  const authorName = byline(article);

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted ${className}`}
    >
      {showAuthor && (
        <span className="font-condensed text-[12px] font-bold tracking-[0.01em] text-brand-navy">
          By {authorName}
        </span>
      )}
      {date && (
        <>
          {showAuthor && <span aria-hidden="true" className="text-border-strong">·</span>}
          <time dateTime={article.publishDate || article.createdAt} className={FOLIO}>
            {date}
          </time>
        </>
      )}
      {showReadTime && (
        <span className={FOLIO}>
          <span aria-hidden="true" className="text-border-strong">·</span>
          <FaRegClock size={10} aria-hidden="true" className="text-brand-cyan-dark" />
          {mins} min read
        </span>
      )}
      {showComments && comments > 0 && (
        <span className={FOLIO}>
          <span aria-hidden="true" className="text-border-strong">·</span>
          <FaRegComment size={10} aria-hidden="true" className="text-brand-cyan-dark" />
          {comments} {comments === 1 ? 'comment' : 'comments'}
        </span>
      )}
      {showViews && views > 0 && (
        <span className={FOLIO}>
          <span aria-hidden="true" className="text-border-strong">·</span>
          <FaRegEye size={10} aria-hidden="true" className="text-brand-cyan-dark" />
          {views.toLocaleString('en-GB')} views
        </span>
      )}
    </div>
  );
}
