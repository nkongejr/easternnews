import Link from 'next/link';
import { api } from '@/lib/api';
import { articleHref } from '@/lib/format';
import SidebarWidget from './SidebarWidget';

/**
 * Ranked by the API's real `viewCount` (sorted server-side), so the ranking is
 * genuine popularity rather than editorial order or a made-up number.
 */
export default async function MostReadWidget({ limit = 6 }: { limit?: number }) {
  let articles: Awaited<ReturnType<typeof api.getMostRead>> = [];
  try {
    articles = await api.getMostRead(limit);
  } catch {
    return null;
  }

  if (!articles?.length) return null;

  return (
    <SidebarWidget
      title="Most Read"
      subtitle="What readers are opening right now"
      accent="var(--color-brand-cyan)"
    >
      <ol className="flex flex-col">
        {articles.map((a, i) => (
          <li
            key={a._id}
            className="flex gap-3 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="w-7 shrink-0 font-headline text-[26px] font-black leading-[0.9] text-brand-primary"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="font-headline text-[15px] font-bold leading-snug tracking-[-0.01em] text-headline">
                <Link href={articleHref(a)} className="line-clamp-3 transition-colors hover:text-brand-primary">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-1.5 font-condensed text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
                {a.category}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SidebarWidget>
  );
}
