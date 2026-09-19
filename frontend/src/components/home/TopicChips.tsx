import Link from 'next/link';

/**
 * Desk sub-topics (Agriculture, Football, SMEs…). Linked to real searches
 * over the article index rather than fabricated category pages, so a topic
 * only ever surfaces stories that actually exist.
 */
export default function TopicChips({
  topics,
  label = 'Topics',
}: {
  topics: { label: string; href: string }[];
  label?: string;
}) {
  if (!topics?.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="en-kicker text-muted">{label}</span>
      <ul className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <li key={t.label}>
            <Link
              href={t.href}
              className="inline-block rounded-sm border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
