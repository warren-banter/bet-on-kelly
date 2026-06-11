import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Knockout bracket',
  description:
    'The World Cup 2026 knockout bracket — predicted route to the final. Coming soon.',
  alternates: { canonical: '/knockout/' },
};

const rounds = [
  { name: 'Round of 32', games: 16 },
  { name: 'Round of 16', games: 8 },
  { name: 'Quarter-finals', games: 4 },
  { name: 'Semi-finals', games: 2 },
  { name: 'Final', games: 1 },
];

export default function KnockoutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Knockout <span className="text-accent">bracket</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            The predicted route through the knockouts — from the Round of 32 to
            the final. The full bracket lands once the knockout predictions are
            in.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Coming soon notice */}
        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">
            Coming soon
          </p>
          <p className="mt-2 max-w-2xl text-ink">
            We are finalising the knockout predictions. When they are ready, this
            page shows the full tree: who tops each group, the Round of 32
            pairings, and our predicted winner all the way to the final.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/groups/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-accent-bright"
            >
              See group predictions
            </Link>
            <Link
              href="/predictions/"
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              All predictions
            </Link>
          </div>
        </div>

        {/* Bracket structure preview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rounds.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <p className="text-sm font-bold text-ink">{r.name}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {r.games} {r.games === 1 ? 'game' : 'games'}
              </p>
              <div className="mt-4 space-y-2">
                {Array.from({ length: Math.min(r.games, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 rounded-md border border-dashed border-line"
                  />
                ))}
                {r.games > 4 && (
                  <p className="text-xs text-ink-soft">
                    + {r.games - 4} more
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
