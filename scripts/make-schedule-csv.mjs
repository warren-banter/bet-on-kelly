#!/usr/bin/env node
// Emit public/epl-schedule-sast.csv — a two-column posting schedule.
//
//   Column 1: "Home v Away - winner pick - second pick", picks written out in
//             plain language rather than betting shorthand.
//   Column 2: "MM/DD/YYYY - HH:MM", when to post it. Times are SAST wall clock.
//
// The posting rule works backwards from each fixture's own day:
//
//   Saturday games  -> spread over the Monday-to-Friday before, one a day,
//                      with any surplus doubling up on the Friday.
//   Sunday games    -> staggered across the Saturday before.
//   Monday games    -> the Sunday before.
//   Anything else   -> the day before (midweek and Friday fixtures).
//
// Within a day the first post goes at 18:00 and a second at 12:00; a day that
// somehow needs more than two falls back to the rest of SLOTS.
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

// Order matters: the first post of a day lands on the first entry.
const SLOTS = ['18:00', '12:00', '15:00', '09:00', '20:00'];

// How many weekdays a Saturday slate spreads over, and how many of those take
// exactly one post before the last day starts absorbing the rest.
const SAT_SPREAD_DAYS = 5;        // Monday through Friday
const SAT_SINGLE_DAYS = 4;        // Monday through Thursday

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

// Calendar helpers. Dates are plain yyyy-mm-dd and handled at UTC midnight so
// no local timezone can shift the day.
function shiftDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const dayOfWeek = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay(); // 0 = Sun

function usDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

// Which day each fixture's post belongs on, given its position in that day's
// running order. Saturday slates walk Monday->Friday; everything else sits on
// a single day and stacks.
function postDate(fixtureDate, index) {
  if (dayOfWeek(fixtureDate) === 6) {
    const offset =
      index < SAT_SINGLE_DAYS
        ? -SAT_SPREAD_DAYS + index   // Mon, Tue, Wed, Thu
        : -1;                        // Friday absorbs the rest
    return shiftDays(fixtureDate, offset);
  }
  return shiftDays(fixtureDate, -1); // Sunday -> Sat, Monday -> Sun, else day before
}

const feed = JSON.parse(await readFile(FEED, 'utf8'));
const games = [...(feed.games ?? [])].sort((a, b) =>
  String(a.kickoff ?? a.date).localeCompare(String(b.kickoff ?? b.date)),
);

// Group by fixture date so each day's running order drives the spread.
const byFixtureDate = new Map();
for (const g of games) {
  if (!byFixtureDate.has(g.date)) byFixtureDate.set(g.date, []);
  byFixtureDate.get(g.date).push(g);
}

// Assign each game a posting day first.
const perDay = new Map(); // post date -> games landing on it
for (const [fixtureDate, dayGames] of byFixtureDate) {
  dayGames.forEach((g, index) => {
    const date = postDate(fixtureDate, index);
    if (!perDay.has(date)) perDay.set(date, []);
    perDay.get(date).push(g);
  });
}

// Then hand out that day's slots in kick-off order, so where a day carries two
// posts the earlier fixture is also the earlier post.
const scheduled = [];
for (const [date, dayGames] of perDay) {
  const times = SLOTS.slice(0, Math.min(dayGames.length, SLOTS.length)).sort();
  dayGames
    .sort((a, b) => String(a.kickoff).localeCompare(String(b.kickoff)))
    .forEach((g, i) => {
      scheduled.push({ game: g, date, time: times[Math.min(i, times.length - 1)] });
    });
}

// Read in the order they should be posted.
scheduled.sort(
  (a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
);

const rows = scheduled.map(({ game: g, date, time }) => {
  const line = [
    `${g.home_team} v ${g.away_team}`,
    plain(g.winner.market, g.winner.selection),
    plain(g.other.market, g.other.selection),
  ].join(' - ');
  return [cell(line), cell(`${usDate(date)} - ${time}`)].join(',');
});

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

await mkdir(OUT_DIR, { recursive: true });
const state = await writeIfChanged(
  OUT,
  ['prediction,post_at_sast', ...rows].join('\n') + '\n',
);
console.log(
  `epl-schedule-sast.csv: ${rows.length} fixtures` +
    (state === 'written' ? '' : ` — ${state}`),
);
