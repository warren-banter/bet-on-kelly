'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Match, formatMatchDate } from '@/content/matches';
import Flag from './Flag';
import PredictButton from './PredictButton';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

// A single game rendered as a full-width row.
// "More info" expands an inline panel of match facts so the user stays on the page.
export default function GameCard({ match }: { match: Match }) {
  const [open, setOpen] = useState(false);
  const homeIsTip = match.tip === match.home;
  const panelId = `info-${match.slug}`;

  return (
    <article className="rounded-xl border border-line bg-surface transition-colors hover:border-accent/40">
      {/* Row */}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-6 md:px-6 md:py-3.5">
        {/* Matchup */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:flex-1 md:gap-5">
          <div className="flex min-w-0 items-center justify-end gap-2.5">
            <span
              className={`truncate text-right text-sm font-semibold md:text-[15px] ${
                homeIsTip ? 'text-ink' : 'text-ink-soft'
              }`}
            >
              {match.home}
            </span>
            <Flag country={match.home} />
          </div>

          <div className="flex flex-col items-center px-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-ink-soft">
              Predicted
            </span>
            <span className="text-xl font-bold tabular-nums leading-none text-ink md:text-2xl">
              {match.homeScore}
              <span className="mx-1.5 text-accent">-</span>
              {match.awayScore}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <Flag country={match.away} />
            <span
              className={`truncate text-sm font-semibold md:text-[15px] ${
                !homeIsTip ? 'text-ink' : 'text-ink-soft'
              }`}
            >
              {match.away}
            </span>
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 md:w-60 md:shrink-0">
          <span className="text-xs text-ink-soft">We tip</span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-accent">
            {match.tip}
          </span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold tabular-nums text-black">
            {match.probability}%
          </span>
        </div>

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
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Fact label="Date" value={formatMatchDate(match.date)} />
            <Fact label="Competition" value="World Cup 2026" />
            <Fact label="Stage" value="Group stage" />
            <Fact label="Predicted winner" value={match.tip} />
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Win probability — {match.tip}
            </span>
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-raised">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${match.probability}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums text-accent">
              {match.probability}%
            </span>
          </div>

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
