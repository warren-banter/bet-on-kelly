import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  allTeams,
  getTeamBySlug,
  getTeamMatches,
  getTeamGroup,
  teamSlug,
  formatMatchDate,
} from '@/content/matches';
import { SITE_NAME } from '@/content/config';
import Flag from '@/components/Flag';
import PredictButton from '@/components/PredictButton';

export function generateStaticParams() {
  return allTeams().map((team) => ({ slug: teamSlug(team) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  return {
    title: `${team} — group games & predictions`,
    description: `${team}'s World Cup 2026 group-stage fixtures with our predicted scores and result for each game.`,
    alternates: { canonical: `/team/${slug}/` },
  };
}

const RESULT_STYLE: Record<string, string> = {
  W: 'bg-accent text-black',
  D: 'bg-raised text-ink',
  L: 'bg-line text-ink-soft',
};

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const teamMatches = getTeamMatches(team);
  const group = getTeamGroup(team);
  const standing = group?.standings.find((s) => s.team === team);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/groups/"
          className="text-sm font-semibold text-accent hover:underline"
        >
          &larr; Group stage
        </Link>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Flag country={team} className="h-10 w-14" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {team}
          </h1>
          {group && (
            <p className="text-sm text-ink-soft">
              {group.name} &middot; FIFA World Cup 2026
            </p>
          )}
        </div>
      </div>

      {/* Predicted group return */}
      {standing && (
        <dl className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            ['Played', standing.played],
            ['Won', standing.won],
            ['Drawn', standing.drawn],
            ['Lost', standing.lost],
            ['Goal diff', standing.gd > 0 ? `+${standing.gd}` : standing.gd],
            ['Points', standing.points],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-line bg-surface px-3 py-3 text-center"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                {label}
              </dt>
              <dd className="mt-1 text-lg font-bold tabular-nums text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Games */}
      <h2 className="mb-3 mt-8 text-base font-bold text-ink">
        Predicted group games
      </h2>
      <div className="space-y-3">
        {teamMatches.map((tm) => (
          <div
            key={tm.match.slug}
            className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${RESULT_STYLE[tm.result]}`}
              title={
                tm.result === 'W'
                  ? 'Predicted win'
                  : tm.result === 'L'
                    ? 'Predicted loss'
                    : 'Predicted draw'
              }
            >
              {tm.result}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-soft">
                  {tm.home ? 'vs' : 'at'}
                </span>
                <Flag country={tm.opponent} />
                <Link
                  href={`/team/${teamSlug(tm.opponent)}/`}
                  className="truncate font-semibold text-ink hover:text-accent"
                >
                  {tm.opponent}
                </Link>
              </div>
              <p className="mt-0.5 text-xs text-ink-soft">
                {formatMatchDate(tm.match.date)} &middot; {tm.match.time} &middot;{' '}
                {tm.match.venue}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-lg font-bold tabular-nums text-ink">
                {tm.forScore}
                <span className="mx-1 text-accent">-</span>
                {tm.againstScore}
              </span>
              <Link
                href={`/game/${tm.match.slug}/`}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PredictButton size="lg" />
      </div>
    </article>
  );
}
