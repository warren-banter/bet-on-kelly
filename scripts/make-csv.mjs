#!/usr/bin/env node
// Emit public/epl-picks.csv from the current betting feed, one row per fixture
// with both picks. Runs as a prebuild step, so the deployed CSV always matches
// the deployed site — which lets Google Sheets pull it live:
//
//   =IMPORTDATA("https://bet-on-kelly.vercel.app/epl-picks.csv")
//
// Upcoming fixtures only; the feed drops a game once it has kicked off.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FEED = join(ROOT, 'content', 'epl_bets.json');
const OUT_DIR = join(ROOT, 'public');
const OUT = join(OUT_DIR, 'epl-picks.csv');

const COLUMNS = [
  'date',
  'kickoff_uk',
  'match',
  'home_team',
  'away_team',
  'pricing',
  'winner_market',
  'winner_selection',
  'winner_probability',
  'winner_odds',
  'other_market',
  'other_selection',
  'other_probability',
  'other_odds',
];

// Quote anything that could break a cell; double up embedded quotes.
function cell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// UK wall-clock kick-off, 24h, from the feed's UTC stamp.
function ukTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/London',
  }).format(d);
}

// The file is often open in a viewer or spreadsheet, and Windows then reports
// EBUSY/EPERM on both the read and the write. A lock is a local-machine
// condition — CI never has one — so warn and carry on rather than failing the
// build; the committed copy is what gets published either way.
async function writeIfChanged(file, body) {
  try {
    if ((await readFile(file, 'utf8')) === body) return 'unchanged';
  } catch { /* missing, or locked — fall through and try the write */ }
  try {
    await writeFile(file, body, 'utf8');
    return 'written';
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      console.warn(`  ! ${file} is locked by another program — left as it is`);
      return 'locked';
    }
    throw err;
  }
}

const feed = JSON.parse(await readFile(FEED, 'utf8'));
const games = [...(feed.games ?? [])].sort((a, b) =>
  String(a.kickoff ?? a.date).localeCompare(String(b.kickoff ?? b.date)),
);

const rows = games.map((g) =>
  [
    g.date,
    ukTime(g.kickoff),
    g.match,
    g.home_team,
    g.away_team,
    g.pricing,
    g.winner.market,
    g.winner.selection,
    g.winner.probability,
    g.winner.odds,
    g.other.market,
    g.other.selection,
    g.other.probability,
    g.other.odds,
  ]
    .map(cell)
    .join(','),
);

await mkdir(OUT_DIR, { recursive: true });
const state = await writeIfChanged(OUT, [COLUMNS.join(','), ...rows].join('\n') + '\n');
console.log(
  `epl-picks.csv: ${rows.length} fixtures (generated ${feed.generated})` +
    (state === 'written' ? '' : ` — ${state}`),
);
