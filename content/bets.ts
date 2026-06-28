// Betting picks for the World Cup 2026 — model/market-blended, no scorelines.
// Source: wc_bets.json. Parsed statically at build time. Each remaining fixture
// carries a `winner` pick (the headline call) and one `other` bet, plus a set of
// two-leg accumulators ("multis").

import data from './wc_bets.json';
import excluded from './excluded_picks.json';
import { type Match, type MatchDay, knockoutMatchesByDate } from './matches';

// Picks/multis pulled from the site (by id). Single source of truth for
// suppression — also honoured by scripts/update-results.mjs.
const EXCLUDED = new Set<string>(excluded.ids);

export interface Bet {
  id: string;
  date: string;
  match: string; // "England vs Croatia"
  home_team: string;
  away_team: string;
  market: string; // "Match Result" | "Double Chance" | "Total Goals" | "Both Teams To Score"
  selection: string; // "England to win"
  probability: number; // 0–1
  odds: number; // fair decimal odds (1 / probability)
}

interface RawPick {
  market: string;
  selection: string;
  probability: number;
  odds: number;
}

interface RawGame {
  id: string;
  date: string;
  match: string;
  home_team: string;
  away_team: string;
  winner: RawPick;
  other: RawPick;
}

export interface MultiLeg {
  id: string;
  date: string;
  match: string;
  home_team: string;
  away_team: string;
  market: string;
  selection: string;
  odds: number;
}

export interface Multi {
  id: string;
  legs: MultiLeg[];
  combined_odds: number;
  combined_probability: number;
}

export const betsGeneratedOn: string = data.generated;
export const remainingFixtures: number = data.remaining_fixtures;

export const multis: Multi[] = ((data.multis ?? []) as Multi[]).filter(
  (m) => !EXCLUDED.has(m.id),
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

const singles: Bet[] = (data.games as RawGame[]).flatMap(gameToBets);

// Key a fixture by date + the two teams (order-independent), matching matches.ts.
function fixtureKey(date: string, a: string, b: string): string {
  return `${date}|${[a, b].sort().join('::')}`;
}

// Picks grouped by fixture, winner pick first.
const byFixture = new Map<string, Bet[]>();
for (const bet of singles) {
  const key = fixtureKey(bet.date, bet.home_team, bet.away_team);
  const list = byFixture.get(key) ?? [];
  list.push(bet);
  byFixture.set(key, list);
}

// All picks for a fixture, headline winner first (empty for played fixtures).
export function getMatchBets(match: Match): Bet[] {
  return byFixture.get(fixtureKey(match.date, match.home, match.away)) ?? [];
}

// The headline pick for a fixture (the winner call).
export function topBet(match: Match): Bet | undefined {
  return getMatchBets(match)[0];
}

export function hasBets(match: Match): boolean {
  return byFixture.has(fixtureKey(match.date, match.home, match.away));
}

// Match days shown on the front-page board: the current (knockout) fixtures that
// still carry active bets, in date order. Group-stage picks stay in the feed for
// the graded track record, but the board leads with the live round only.
export function betDaysByDate(): MatchDay[] {
  return knockoutMatchesByDate()
    .map((day) => ({ ...day, matches: day.matches.filter(hasBets) }))
    .filter((day) => day.matches.length > 0);
}

// ---- Formatting helpers ----------------------------------------------------

export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}
