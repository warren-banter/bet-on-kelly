// Settled predictions, graded against real final scores by scripts/update-results.mjs
// (run on a schedule by .github/workflows/update-results.yml). Read at build time.

import data from './wc_results.json';

export type Outcome = 'won' | 'lost' | 'void' | 'pending';

export interface SettledBet {
  id: string;
  date: string;
  match: string;
  home_team: string;
  away_team: string;
  market: string;
  selection: string;
  odds: number;
  probability: number;
  homeScore?: number;
  awayScore?: number;
  result: Outcome;
}

export interface ResultsSummary {
  settled: number;
  won: number;
  lost: number;
  hitRate: number; // 0–1
}

const summary: ResultsSummary = data.summary;

// Settled singles only (won/lost), newest first.
export const settledBets: SettledBet[] = (data.singles as SettledBet[])
  .filter((b) => b.result === 'won' || b.result === 'lost')
  .sort((a, b) => b.date.localeCompare(a.date));

export const resultsSummary: ResultsSummary = summary;

export const resultsUpdated: string | null = data.updated;

export function hasResults(): boolean {
  return summary.settled > 0;
}

export function formatHitRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
