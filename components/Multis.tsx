import { multis, formatProbability, formatOdds } from '@/content/bets';
import PredictButton from './PredictButton';

// Two-leg accumulators. Static section rendered below the singles board.
export default function Multis() {
  if (multis.length === 0) return null;

  return (
    <section
      id="accumulators"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Bigger odds
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Two-leg accumulators
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Two picks combined into one bet. Both legs must land. Bigger odds, less
          margin for error.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {multis.map((multi) => (
          <article
            key={multi.id}
            className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/40"
          >
            <ol className="flex-1 space-y-3">
              {multi.legs.map((leg) => (
                <li key={leg.id} className="border-b border-line pb-3 last:border-none last:pb-0">
                  <p className="text-sm font-bold text-ink">{leg.match}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm text-ink-soft">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                        {leg.market}
                      </span>
                      <span className="mx-1.5 text-line">&middot;</span>
                      <span className="font-semibold text-ink">
                        {leg.selection}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-ink-soft">
                      {formatOdds(leg.odds)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/10 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  Combined &middot; {formatProbability(multi.combined_probability)}
                </p>
                <p className="text-2xl font-extrabold tabular-nums leading-none text-accent">
                  {formatOdds(multi.combined_odds)}
                </p>
              </div>
              <PredictButton label="Predict here" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
