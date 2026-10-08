/**
 * Consistent chrome for every rail module: a solid navy bar carrying the
 * desk's accent on its left edge, with a condensed white title, then the
 * module body inside a hairline box.
 */
export default function SidebarWidget({
  title,
  subtitle,
  children,
  accent = 'var(--color-brand-secondary)',
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden border border-border-strong ${className}`}>
      <div
        className="border-l-[5px] bg-brand-navy px-3.5 py-2.5"
        style={{ borderLeftColor: accent }}
      >
        <h2 className="font-condensed text-[13.5px] font-bold uppercase leading-tight tracking-[0.1em] text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 font-condensed text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brand-cyan">
            {subtitle}
          </p>
        )}
      </div>
      <div className="bg-white p-3.5">{children}</div>
    </section>
  );
}
