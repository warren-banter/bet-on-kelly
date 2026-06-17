'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Match, formatMatchDate } from '@/content/matches';
import {
  type Bet,
  getMatchBets,
  formatProbability,
  formatOdds,
} from '@/content/bets';
import Flag from './Flag';
import PredictButton from './PredictButton';

function BetRow({ bet }: { bet: Bet }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-page px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          {bet.market}
        </p>
        <p className="truncate text-sm font-semibold text-ink">
          {bet.selection}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs font-medium tabular-nums text-ink-soft">
          {formatProbability(bet.probability)}
        </span>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-sm font-bold tabular-nums text-accent">
          {formatOdds(bet.odds)}
        </span>
      </div>
    </div>
  );
}

// A single fixture rendered as a full-width row, leading with our top pick.
// "More info" expands every pick for the fixture plus the match facts.
export default function GameCard({ match }: { match: Match }) {
  const [open, setOpen] = useState(false);
  const bets = getMatchBets(match);
  const top = bets[0];
  const panelId = `info-${match.slug}`;

  return (
    <article className="rounded-xl border border-line bg-surface transition-colors hover:border-accent/40">
      {/* Row */}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-6 md:px-6 md:py-3.5">
        {/* Matchup */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:flex-1 md:gap-5">
          <div className="flex min-w-0 items-center justify-end gap-2.5">
            <span className="truncate text-right text-sm font-semibold text-ink md:text-[15px]">
              {match.home}
            </span>
            <Flag country={match.home} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            v
          </span>

          <div className="flex min-w-0 items-center gap-2.5">
            <Flag country={match.away} />
            <span className="truncate text-sm font-semibold text-ink md:text-[15px]">
              {match.away}
            </span>
          </div>
        </div>

        {/* Top pick */}
        {top && (
          <div className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 md:w-72 md:shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                Top pick &middot; {top.market}
              </span>
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-bold tabular-nums text-black">
                {formatOdds(top.odds)}
              </span>
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-accent">
                {top.selection}
              </span>
              <span className="text-xs font-semibold tabular-nums text-ink-soft">
                {formatProbability(top.probability)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent md:px-5"
          >
            {open ? 'Less' : 'More info'}
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
          <PredictButton className="md:px-5" />
        </div>
      </div>

      {/* Expandable info panel */}
      {open && (
        <div
          id={panelId}
          className="border-t border-line px-4 py-4 md:px-6 md:py-5"
        >
          {bets.length > 0 && (
            <>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                {bets.length === 1
                  ? 'Our pick'
                  : `Our picks (${bets.length})`}
              </p>
              <div className="space-y-2">
                {bets.map((bet) => (
                  <BetRow key={bet.id} bet={bet} />
                ))}
              </div>
            </>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                Date
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {formatMatchDate(match.date)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                Kick-off
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {match.time}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                Venue
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {match.venue}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                Competition
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                World Cup 2026
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PredictButton size="lg" />
            <Link
              href={`/game/${match.slug}/`}
              className="text-sm font-semibold text-ink-soft underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Open full match page
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
