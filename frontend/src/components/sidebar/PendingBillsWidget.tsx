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
    <div className="bg-gray-50 border rounded-lg p-4">
      <h3 className="font-headline font-bold text-brand-blue mb-1 uppercase text-sm">
        Latest Pending Bills
      </h3>
      <p className="text-xs text-gray-500 mb-3">Figures in Ksh Billions (indicative)</p>
      <div className="space-y-2">
        {DATA.map((d) => (
          <div key={d.county}>
            <div className="flex justify-between text-xs mb-1">
              <span>{d.county}</span>
              <span className="font-semibold">Ksh {d.amount}B</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-brand-gold h-2 rounded"
                style={{ width: `${(d.amount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}