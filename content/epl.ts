// Premier League picks — model/market-blended, no scorelines.
// Source: epl_bets.json, exported by the prediction pipeline and parsed
// statically at build time. The feed IS the fixture list: it only ever carries
// upcoming games, so anything that has kicked off drops out on the next export
// and lives on in the graded track record instead.

import data from './epl_bets.json';
import excluded from './excluded_picks.json';
import { type Bet } from './bets';
import { type Match, type MatchDay, formatMatchDate } from './matches';

const EXCLUDED = new Set<string>(excluded.ids);

export const COMPETITION = 'Premier League';

interface RawPick {
  market: string;
  selection: string;
  probability: number;
  odds: number;
}

interface RawGame {
  id: string;
  date: string;
  kickoff: string; // ISO-8601, UTC
  match: string;
  home_team: string;
  away_team: string;
  pricing: string; // "model+market" | "market-only"
  winner: RawPick;
  other: RawPick;
}

const games = data.games as RawGame[];

export const eplGeneratedOn: string = data.generated;
export const eplFixtureCount: number = games.length;

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function eplMatchSlug(game: {
  date: string;
  home_team: string;
  away_team: string;
}): string {
  return `${game.date}-${slugify(game.home_team)}-vs-${slugify(game.away_team)}`;
}

// UK kick-off, e.g. "8:00 PM BST". The feed stamps UTC; the season runs Aug–May
// so it spans BST and GMT, and Intl handles the switch from the instant itself.
function ukKickoff(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'TBC';
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/London',
    timeZoneName: 'short',
  })
    .format(d)
    .toUpperCase()
    .replace(/ /g, ' ');
}

// Fixtures shaped like the World Cup `Match` so the shared card/board render
// them unchanged. No score, no venue: these are all still to be played, and
// club grounds aren't in the feed.
export const eplMatches: Match[] = games
  .map((g) => ({
    slug: eplMatchSlug(g),
    date: g.date,
    home: g.home_team,
    away: g.away_team,
    homeScore: 0,
    awayScore: 0,
    tip: '',
    probability: 0,
    time: ukKickoff(g.kickoff),
    venue: '',
    round: 'Premier League',
  }))
  .sort(
    (a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug),
  );

// Flatten each game into its two picks (winner first), dropping any excluded.
function gameToBets(game: RawGame): Bet[] {
  const base = {
    date: game.date,
    match: game.match,
    home_team: game.home_team,
    away_team: game.away_team,
  };
  return [
    { id: `${game.id}-winner`, ...base, ...game.winner },
    { id: `${game.id}-other`, ...base, ...game.other },
  ].filter((b) => !EXCLUDED.has(b.id));
}

// slug -> its picks, headline winner first. A plain object so it can cross the
// server/client boundary as a prop.
export const eplBetsBySlug: Record<string, Bet[]> = Object.fromEntries(
  games
    .map((g) => [eplMatchSlug(g), gameToBets(g)] as const)
    .filter(([, bets]) => bets.length > 0),
);

export function getEplBets(slug: string): Bet[] {
  return eplBetsBySlug[slug] ?? [];
}

// Fixtures that still carry at least one active pick, grouped by date and
// ordered within a day by real kick-off.
export function eplDaysByDate(): MatchDay[] {
  const withBets = eplMatches.filter((m) => getEplBets(m.slug).length > 0);
  const byDate = new Map<string, Match[]>();
  for (const m of withBets) {
    const list = byDate.get(m.date) ?? [];
    list.push(m);
    byDate.set(m.date, list);
  }
  const kickoffOf = new Map(games.map((g) => [eplMatchSlug(g), g.kickoff]));
  return Array.from(byDate.keys())
    .sort()
    .map((date) => ({
      date,
      label: formatMatchDate(date),
      matches: byDate
        .get(date)!
        .sort((a, b) =>
          (kickoffOf.get(a.slug) ?? '').localeCompare(kickoffOf.get(b.slug) ?? ''),
        ),
    }));
}

export function getEplMatchBySlug(slug: string): Match | undefined {
  return eplMatches.find((m) => m.slug === slug);
}
