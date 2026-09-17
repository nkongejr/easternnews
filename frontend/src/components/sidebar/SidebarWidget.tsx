/**
 * Consistent chrome for every rail module: uppercase rule-titled heading on
 * a hairline, then the module body. Keeps all sidebar boxes visually aligned.
 */
export default function SidebarWidget({
  title,
  subtitle,
  children,
  accent = 'var(--color-brand-blue)',
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-4 border-b-2 pb-2" style={{ borderColor: accent }}>
        <h2 className="font-headline text-base font-black uppercase tracking-tight" style={{ color: accent }}>
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-[11px] text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
