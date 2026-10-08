import SidebarWidget from './SidebarWidget';

// Illustrative infographic widget — editors can update figures via CMS later.
const DATA = [
  { county: 'Meru', amount: 2.1 },
  { county: 'Embu', amount: 1.4 },
  { county: 'Kitui', amount: 1.8 },
  { county: 'Machakos', amount: 2.6 },
  { county: 'Makueni', amount: 1.1 },
];

export default function PendingBillsWidget() {
  const max = Math.max(...DATA.map((d) => d.amount));

  return (
    <SidebarWidget
      title="Latest Pending Bills"
      subtitle="Figures in Ksh Billions (indicative)"
      accent="var(--color-accent)"
    >
      <dl className="space-y-2.5">
        {DATA.map((d) => (
          <div key={d.county}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <dt className="font-condensed font-bold uppercase tracking-[0.08em] text-brand-navy">{d.county}</dt>
              <dd className="font-condensed font-bold tracking-[0.02em] text-text">Ksh {d.amount}B</dd>
            </div>
            <div
              className="mt-1.5 h-2.5 w-full bg-surface-sunken"
              role="img"
              aria-label={`${d.county}: Ksh ${d.amount} billion`}
            >
              <div
                className="h-2.5 bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-cyan))]"
                style={{ width: `${(d.amount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </SidebarWidget>
  );
}
