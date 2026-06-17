'use client';

import { useState } from 'react';
import { formatMatchDate } from '@/content/matches';
import {
  type SettledBet,
  settledBets,
  resultsSummary,
  hasResults,
  formatHitRate,
} from '@/content/results';
import { formatOdds, formatProbability } from '@/content/bets';

function ResultBadge({ result }: { result: SettledBet['result'] }) {
  const won = result === 'won';
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
        won
          ? 'bg-accent text-black'
          : 'border border-line text-ink-soft'
      }`}
    >
      {won ? 'Won' : 'Lost'}
    </span>
  );
}

function SettledRow({ bet }: { bet: SettledBet }) {
  const score =
    bet.homeScore != null && bet.awayScore != null
      ? `${bet.homeScore}–${bet.awayScore}`
      : '';
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">
          {bet.match}
          {score && (
            <span className="ml-2 font-semibold tabular-nums text-ink-soft">
              {score}
            </span>
          )}
        </p>
        <p className="truncate text-xs text-ink-soft">
          <span className="font-semibold uppercase tracking-wider">
            {bet.market}
          </span>
          <span className="mx-1.5 text-line">&middot;</span>
          {bet.selection}
          <span className="mx-1.5 text-line">&middot;</span>
          <span className="tabular-nums">{formatOdds(bet.odds)}</span>
        </p>
      </div>
      <ResultBadge result={bet.result} />
    </div>
  );
}

// Front-page track record: how our picks have actually done, graded against
// real final scores. Shows nothing but a quiet placeholder until results land.
export default function PreviousPredictions() {
  const [open, setOpen] = useState(false);
  const settled = hasResults();

  return (
    <section
      id="track-record"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
    >
      <div className="rounded-2xl border border-line bg-surface/60 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Track record
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          How our predictions did
        </h2>

        {!settled ? (
          <p className="mt-3 max-w-xl text-sm text-ink-soft">
            We grade every pick against the real result. Outcomes show up here as
            fixtures finish — check back once the first games are played.
          </p>
        ) : (
          <>
            <p className="mt-3 text-base text-ink-soft">
              <span className="font-bold text-ink">
                {resultsSummary.won} of {resultsSummary.settled}
              </span>{' '}
              settled picks landed —{' '}
              <span className="font-bold text-accent">
                {formatHitRate(resultsSummary.hitRate)}
              </span>{' '}
              strike rate.
            </p>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {open
                ? 'Hide previous predictions'
                : `See our previous predictions (${resultsSummary.settled})`}
              <svg
                className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {open && (
              <div className="mt-5 space-y-2">
                {settledBets.map((bet) => (
                  <SettledRow key={bet.id} bet={bet} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
