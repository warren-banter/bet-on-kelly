#!/usr/bin/env node
// Emit public/epl-schedule-sast.csv — a two-column scheduling sheet.
//
//   Column 1: "Home v Away - winner pick - second pick", picks written out in
//             plain language rather than betting shorthand.
//   Column 2: "MM/DD/YYYY - HH:MM", the kick-off in South African time (SAST,
//             UTC+2) with four hours taken off, for scheduling ahead of the game.
//
// Runs as a prebuild step alongside make-csv.mjs.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FEED = join(ROOT, 'content', 'epl_bets.json');
const OUT_DIR = join(ROOT, 'public');
const OUT = join(OUT_DIR, 'epl-schedule-sast.csv');

const SAST_OFFSET_HOURS = 2;   // South Africa has no daylight saving
const LEAD_HOURS = 4;          // how far ahead of kick-off the row is stamped

// Betting shorthand -> plain English. Over/under lines are half-goals, so
// "Under 3.5" is "less than 4 goals" and "Over 2.5" is "more than 2 goals".
function plain(market, selection) {
  const totals = selection.match(/^(Over|Under)\s+([\d.]+)\s+goals$/i);
  if (totals) {
    const line = parseFloat(totals[2]);
    if (totals[1].toLowerCase() === 'under') {
      const n = Math.ceil(line);
      return `less than ${n} goal${n === 1 ? '' : 's'}`;
    }
    const n = Math.floor(line);
    return `more than ${n} goal${n === 1 ? '' : 's'}`;
  }
  if (market === 'Both Teams To Score') {
    return /^yes$/i.test(selection.trim())
      ? 'both teams to score'
      : 'both teams not to score';
  }
  if (market === 'Double Chance') {
    return selection.replace(/\s+or\s+Draw$/i, ' or draw');
  }
  return selection; // "X to win" already reads plainly
}

function cell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Kick-off (UTC in the feed) -> SAST, minus the lead time, as MM/DD/YYYY - HH:MM.
function stamp(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const shifted = new Date(
    d.getTime() + (SAST_OFFSET_HOURS - LEAD_HOURS) * 3600 * 1000,
  );
  const p = (n) => String(n).padStart(2, '0');
  // Read UTC components: the offset is already baked into `shifted`.
  return (
    `${p(shifted.getUTCMonth() + 1)}/${p(shifted.getUTCDate())}/${shifted.getUTCFullYear()}` +
    ` - ${p(shifted.getUTCHours())}:${p(shifted.getUTCMinutes())}`
  );
}

const feed = JSON.parse(await readFile(FEED, 'utf8'));
const games = [...(feed.games ?? [])].sort((a, b) =>
  String(a.kickoff ?? a.date).localeCompare(String(b.kickoff ?? b.date)),
);

const rows = games.map((g) => {
  const line = [
    `${g.home_team} v ${g.away_team}`,
    plain(g.winner.market, g.winner.selection),
    plain(g.other.market, g.other.selection),
  ].join(' - ');
  return [cell(line), cell(stamp(g.kickoff))].join(',');
});

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, ['prediction,post_at_sast', ...rows].join('\n') + '\n', 'utf8');
console.log(`epl-schedule-sast.csv: ${rows.length} fixtures`);
