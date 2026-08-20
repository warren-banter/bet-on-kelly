// Settled Premier League predictions, graded against real final scores by
// scripts/update-results.mjs (run on a schedule by the update-results workflow).
// Read at build time. Same shape as the World Cup results feed.

import data from './epl_results.json';
import { type SettledBet, type ResultsSummary } from './results';

const summary: ResultsSummary = data.summary;

export const eplSettledBets: SettledBet[] = (data.singles as SettledBet[])
  .filter((b) => b.result === 'won' || b.result === 'lost')
  .sort((a, b) => b.date.localeCompare(a.date));

export const eplResultsSummary: ResultsSummary = summary;

export const eplResultsUpdated: string | null = data.updated;

export function hasEplResults(): boolean {
  return summary.settled > 0;
}
