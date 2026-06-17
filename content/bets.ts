// Betting picks for the World Cup 2026 — model/market-blended, no scorelines.
// Source: wc_bets.json (generated 2026-06-17). Parsed statically at build time.
// Each remaining fixture has one or more "single" picks across markets, plus a
// set of two-leg accumulators ("multis").

import data from './wc_bets.json';
import { type Match, type MatchDay, matchesByDate } from './matches';

export interface Bet {
  id: string;
  date: string;
  match: string; // "Egypt vs Iran"
  home_team: string;
  away_team: string;
  market: string; // "Total Goals" | "Both Teams To Score" | "Match Result" | "Double Chance"
  selection: string; // "Over 1.5 goals"
  probability: number; // 0–1
  odds: number; // fair decimal odds (1 / probability)
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
export const multis: Multi[] = data.multis as Multi[];

const singles: Bet[] = data.singles as Bet[];

// Key a fixture by date + the two teams (order-independent), matching matches.ts.
function fixtureKey(date: string, a: string, b: string): string {
  return `${date}|${[a, b].sort().join('::')}`;
}

// Singles grouped by fixture, each list sorted by probability (best first).
const byFixture = new Map<string, Bet[]>();
for (const bet of singles) {
  const key = fixtureKey(bet.date, bet.home_team, bet.away_team);
  const list = byFixture.get(key) ?? [];
  list.push(bet);
  byFixture.set(key, list);
}
for (const list of byFixture.values()) {
  list.sort((a, b) => b.probability - a.probability);
}

// All picks for a fixture, best first (empty for fixtures already played).
export function getMatchBets(match: Match): Bet[] {
  return byFixture.get(fixtureKey(match.date, match.home, match.away)) ?? [];
}

// The single highest-probability pick for a fixture.
export function topBet(match: Match): Bet | undefined {
  return getMatchBets(match)[0];
}

export function hasBets(match: Match): boolean {
  return byFixture.has(fixtureKey(match.date, match.home, match.away));
}

// Match days restricted to fixtures that still have active bets, in date order.
export function betDaysByDate(): MatchDay[] {
  return matchesByDate()
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
