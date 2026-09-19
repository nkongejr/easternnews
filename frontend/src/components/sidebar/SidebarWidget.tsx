/**
 * Consistent chrome for every rail module: a solid Eastern-blue bar with a
 * white uppercase title, then the module body inside a hairline box.
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
    <section className={`overflow-hidden border border-border ${className}`}>
      <div
        className="border-l-4 bg-brand-primary px-3.5 py-2.5"
        style={{ borderLeftColor: accent }}
      >
        <h2 className="font-headline text-[13px] font-black uppercase tracking-wide text-white">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-[11px] text-white/70">{subtitle}</p>}
      </div>
      <div className="bg-white p-3.5">{children}</div>
    </section>
  );
}
