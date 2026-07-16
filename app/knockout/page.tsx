import type { Metadata } from 'next';
import Link from 'next/link';
import { knockoutMatches, knockoutMatchesByDate } from '@/content/matches';
import { hasBets } from '@/content/bets';
import GameCard from '@/components/GameCard';

export const metadata: Metadata = {
  title: 'Knockout predictions',
  description:
    'World Cup 2026 knockout predictions — our betting picks for every tie, from the Round of 32 to the final, added as the bracket fills out.',
  alternates: { canonical: '/knockout/' },
};

// The knockout bracket, with how many ties each round holds. Round names match
// the labels derived in content/matches.ts (knockoutRound).
const ROUNDS = [
  { key: 'Round of 32', label: 'Round of 32', total: 16 },
  { key: 'Round of 16', label: 'Round of 16', total: 8 },
  { key: 'Quarter-final', label: 'Quarter-finals', total: 4 },
  { key: 'Semi-final', label: 'Semi-finals', total: 2 },
  { key: 'Third-place play-off', label: 'Third place', total: 1 },
  { key: 'Final', label: 'Final', total: 1 },
];

export default function KnockoutPage() {
  const days = knockoutMatchesByDate()
    .map((day) => ({ ...day, matches: day.matches.filter(hasBets) }))
    .filter((day) => day.matches.length > 0);
  const published = days.reduce((n, day) => n + day.matches.length, 0);

  // Published ties per round, keyed by the round label on each fixture.
  const liveByRound = new Map<string, number>();
  for (const m of knockoutMatches) {
    if (m.round) liveByRound.set(m.round, (liveByRound.get(m.round) ?? 0) + 1);
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Knockout <span className="text-accent">predictions</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            Our betting picks for the knockouts — a headline call plus one other
            bet per tie. {published} ties are live; more land as each round is
            set.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Live ties */}
        <section className="mb-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              The picks
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Every tie, match by match
            </h2>
          </div>

          {days.length > 0 ? (
            days.map((day) => (
              <div key={day.date} className="mb-7 last:mb-0">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">
                  {day.label}
                </h3>
                <div className="space-y-3">
                  {day.matches.map((match) => (
                    <GameCard key={match.slug} match={match} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="max-w-xl text-sm text-ink-soft">
              The knockout ties are being finalised. Picks show here as each one
              is set.
            </p>
          )}
        </section>

        {/* Road to the final */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              The bracket
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Road to the final
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {ROUNDS.map((r) => {
              const live = liveByRound.get(r.key) ?? 0;
              return (
                <div
                  key={r.key}
                  className={`rounded-2xl border p-5 ${
                    live > 0
                      ? 'border-accent/30 bg-accent/10'
                      : 'border-line bg-surface'
                  }`}
                >
                  <p className="text-sm font-bold text-ink">{r.label}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {r.total} {r.total === 1 ? 'game' : 'games'}
                  </p>
                  <p
                    className={`mt-4 text-xs font-semibold uppercase tracking-wider ${
                      live > 0 ? 'text-accent' : 'text-ink-soft'
                    }`}
                  >
                    {live > 0 ? `${live} of ${r.total} live` : 'Pending'}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#predictions"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-accent-bright"
            >
              All predictions
            </Link>
            <Link
              href="/groups/"
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              See group predictions
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
