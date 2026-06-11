import Link from 'next/link';
import type { Match } from '@/content/matches';
import Flag from './Flag';
import PredictButton from './PredictButton';

export default function FixtureRow({ match }: { match: Match }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/40 md:flex-row md:items-center md:gap-5 md:px-5 md:py-3">
      {/* Kick-off */}
      <div className="flex items-center gap-2 md:w-36 md:flex-col md:items-start md:gap-0.5">
        <span className="text-sm font-bold text-ink">{match.time}</span>
        <span className="text-xs text-ink-soft">{match.venue}</span>
      </div>

      {/* Teams */}
      <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-2.5">
          <span className="truncate text-right text-sm font-semibold text-ink">
            {match.home}
          </span>
          <Flag country={match.home} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          v
        </span>
        <div className="flex min-w-0 items-center gap-2.5">
          <Flag country={match.away} />
          <span className="truncate text-sm font-semibold text-ink">
            {match.away}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">
        <Link
          href={`/game/${match.slug}/`}
          className="inline-flex items-center justify-center rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent md:px-5"
        >
          Prediction
        </Link>
        <PredictButton className="md:px-5" />
      </div>
    </article>
  );
}
