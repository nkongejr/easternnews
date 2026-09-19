import Link from 'next/link';
import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { articleHref, formatDate } from '@/lib/format';
import SidebarWidget from './SidebarWidget';

/** Fresh headlines for the right-hand rail. */
export default async function LatestUpdatesWidget({ limit = 6 }: { limit?: number }) {
  const result = await safe(api.getArticles({ limit: String(limit) }), EMPTY_PAGE);
  if (!result.data.length) return null;

  return (
    <SidebarWidget title="Latest Updates" subtitle="Just published">
      <ul>
        {result.data.map((a) => (
          <li key={a._id} className="border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
            <h3 className="font-headline text-[15px] font-bold leading-snug text-ink">
              <Link href={articleHref(a)} className="line-clamp-2 hover:text-brand-primary">
                {a.title}
              </Link>
            </h3>
            <p className="mt-1 text-[11px] text-muted">
              <span className="font-semibold text-brand-primary">{a.category}</span>
              {a.publishDate && (
                <>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={a.publishDate}>{formatDate(a.publishDate)}</time>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </SidebarWidget>
  );
}
