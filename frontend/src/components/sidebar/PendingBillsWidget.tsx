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
              <dt className="font-semibold text-ink">{d.county}</dt>
              <dd className="font-bold text-ink">Ksh {d.amount}B</dd>
            </div>
            <div
              className="mt-1 h-2 w-full bg-surface-sunken"
              role="img"
              aria-label={`${d.county}: Ksh ${d.amount} billion`}
            >
              <div
                className="h-2 bg-brand-gold"
                style={{ width: `${(d.amount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </SidebarWidget>
  );
}
