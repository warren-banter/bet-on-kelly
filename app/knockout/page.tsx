import type { Metadata } from 'next';
import Link from 'next/link';
import { knockoutMatchesByDate } from '@/content/matches';
import { hasBets } from '@/content/bets';
import GameCard from '@/components/GameCard';

export const metadata: Metadata = {
  title: 'Knockout predictions',
  description:
    'World Cup 2026 knockout predictions — our Round of 32 betting picks, tie by tie, with the rest of the bracket added as it fills out.',
  alternates: { canonical: '/knockout/' },
};

// 16 ties make up the Round of 32; we publish each as its half of the bracket is set.
const ROUND_OF_32_TIES = 16;

const rounds = [
  { name: 'Round of 32', games: 16 },
  { name: 'Round of 16', games: 8 },
  { name: 'Quarter-finals', games: 4 },
  { name: 'Semi-finals', games: 2 },
  { name: 'Final', games: 1 },
];

export default function KnockoutPage() {
  const days = knockoutMatchesByDate()
    .map((day) => ({ ...day, matches: day.matches.filter(hasBets) }))
    .filter((day) => day.matches.length > 0);
  const published = days.reduce((n, day) => n + day.matches.length, 0);

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
            Our betting picks for the Round of 32 — a headline call plus one other
            bet per tie. {published} of {ROUND_OF_32_TIES} ties are live; the rest
            land as the bracket fills out.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Live ties */}
        <section className="mb-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Round of 32
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Our picks
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
              The Round of 32 ties are being finalised. Picks show here as each one
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
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {rounds.map((r, i) => {
              const live = i === 0;
              return (
                <div
                  key={r.name}
                  className={`rounded-2xl border p-5 ${
                    live ? 'border-accent/30 bg-accent/10' : 'border-line bg-surface'
                  }`}
                >
                  <p className="text-sm font-bold text-ink">{r.name}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {r.games} {r.games === 1 ? 'game' : 'games'}
                  </p>
                  <p
                    className={`mt-4 text-xs font-semibold uppercase tracking-wider ${
                      live ? 'text-accent' : 'text-ink-soft'
                    }`}
                  >
                    {live ? `${published} of ${r.games} live` : 'Pending'}
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
