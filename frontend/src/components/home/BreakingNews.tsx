import Link from 'next/link';
import { Article } from '@/types';
import { articleHref } from '@/lib/format';

/**
 * Compact "Latest" strip under the navigation.
 *
 * A single horizontally-scrollable row of headlines — deliberately low-key so
 * it never pushes the lead story below the fold. No auto-scrolling marquee:
 * it would fail reduced-motion users and cost layout stability for nothing.
 */
export default function BreakingNews({ articles }: { articles: Article[] }) {
  if (!articles?.length) return null;

  return (
    <section aria-label="Latest news" className="border-b border-border bg-white">
      <div className="en-container flex items-center gap-3 py-2 md:gap-4">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" aria-hidden="true" />
          Latest
        </span>

        <ul className="en-scrollbar-none flex min-w-0 flex-1 items-center overflow-x-auto">
          {articles.map((a, i) => (
            <li key={a._id} className="flex shrink-0 items-center">
              {i > 0 && (
                <span aria-hidden="true" className="mx-3 h-3 w-px bg-border-strong md:mx-4" />
              )}
              <Link
                href={articleHref(a)}
                className="line-clamp-1 max-w-[62vw] text-[13px] font-semibold text-ink/85 transition-colors hover:text-brand-blue sm:max-w-[340px]"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/archive"
          className="hidden shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-brand-blue lg:block"
        >
          All stories
        </Link>
      </div>
    </section>
  );
}
