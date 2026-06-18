#!/usr/bin/env node
// Automated results pipeline.
//
//   1. Archive the picks currently in content/wc_bets.json into
//      content/placed_picks.json (so a pick is kept even after its fixture
//      drops off the upcoming feed).
//   2. Fetch finished World Cup fixtures + scores from ESPN's public
//      scoreboard (no API key required, covers the current tournament).
//   3. Grade every archived pick against the final score.
//   4. Write content/wc_results.json (graded picks + a summary record).
//
// Designed to fail safe: on a fetch error it still archives picks and leaves
// the existing results file untouched, so the site always builds. Intended to
// run on a schedule (GitHub Action), which commits the changed JSON and
// triggers a Vercel rebuild.
//
// Flags:
//   --selftest         Run the grading unit checks and exit.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'content');
const BETS_FILE = join(CONTENT, 'wc_bets.json');
const MATCHES_FILE = join(CONTENT, 'matches.ts');
const ARCHIVE_FILE = join(CONTENT, 'placed_picks.json');
const RESULTS_FILE = join(CONTENT, 'wc_results.json');
const EXCLUDED_FILE = join(CONTENT, 'excluded_picks.json');

// Flatten a feed game into its two picks (winner + other). Ids mirror the
// scheme in content/bets.ts so exclusion and grading line up across both.
function gameToBets(game) {
  const base = {
    date: game.date,
    match: game.match,
    home_team: game.home_team,
    away_team: game.away_team,
  };
  return [
    { id: `${game.id}-winner`, ...base, ...game.winner },
    { id: `${game.id}-other`, ...base, ...game.other },
  ];
}

// --- Grading -----------------------------------------------------------------

function norm(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

// Outcome of a finished match from the perspective of team names.
function outcome(home, away, hs, as) {
  if (hs > as) return norm(home);
  if (as > hs) return norm(away);
  return 'draw';
}

// Grade a single selection given the final score. Returns 'won' | 'lost'.
export function gradeSelection(market, selection, home, away, hs, as) {
  const total = hs + as;
  const btts = hs > 0 && as > 0;
  const result = outcome(home, away, hs, as);

  switch (market) {
    case 'Match Result': {
      if (norm(selection) === 'draw') return result === 'draw' ? 'won' : 'lost';
      const team = selection.replace(/\s+to win$/i, '');
      return result === norm(team) ? 'won' : 'lost';
    }
    case 'Double Chance': {
      // e.g. "Draw or Iran", "Ghana or Draw"
      const parts = selection.split(/\s+or\s+/i).map((p) => p.trim());
      const covered = parts.map((p) => (/^draw$/i.test(p) ? 'draw' : norm(p)));
      return covered.includes(result) ? 'won' : 'lost';
    }
    case 'Total Goals': {
      const m = selection.match(/(over|under)\s+([\d.]+)/i);
      if (!m) return 'lost';
      const line = parseFloat(m[2]);
      const over = m[1].toLowerCase() === 'over';
      return (over ? total > line : total < line) ? 'won' : 'lost';
    }
    case 'Both Teams To Score': {
      const yes = /^yes$/i.test(selection.trim());
      return yes === btts ? 'won' : 'lost';
    }
    default:
      return 'lost';
  }
}

function selftest() {
  const cases = [
    ['Match Result', 'Uruguay to win', 'Uruguay', 'Cape Verde', 1, 0, 'won'],
    ['Match Result', 'Uruguay to win', 'Uruguay', 'Cape Verde', 0, 1, 'lost'],
    ['Match Result', 'Draw', 'A', 'B', 2, 2, 'won'],
    ['Double Chance', 'Draw or Iran', 'Egypt', 'Iran', 1, 1, 'won'],
    ['Double Chance', 'Draw or Iran', 'Egypt', 'Iran', 0, 1, 'won'],
    ['Double Chance', 'Draw or Iran', 'Egypt', 'Iran', 2, 0, 'lost'],
    ['Double Chance', 'Ghana or Draw', 'Ghana', 'Panama', 1, 0, 'won'],
    ['Total Goals', 'Over 1.5 goals', 'A', 'B', 1, 1, 'won'],
    ['Total Goals', 'Over 1.5 goals', 'A', 'B', 1, 0, 'lost'],
    ['Total Goals', 'Under 3.5 goals', 'A', 'B', 2, 1, 'won'],
    ['Total Goals', 'Under 3.5 goals', 'A', 'B', 2, 2, 'lost'],
    ['Both Teams To Score', 'No', 'A', 'B', 1, 0, 'won'],
    ['Both Teams To Score', 'Yes', 'A', 'B', 1, 0, 'lost'],
    ['Both Teams To Score', 'Yes', 'A', 'B', 2, 1, 'won'],
  ];
  let pass = 0;
  for (const [mkt, sel, h, a, hs, as, want] of cases) {
    const got = gradeSelection(mkt, sel, h, a, hs, as);
    const ok = got === want;
    if (ok) pass++;
    else console.error(`FAIL ${mkt} "${sel}" ${h} ${hs}-${as} ${a}: got ${got}, want ${want}`);
  }
  console.log(`selftest: ${pass}/${cases.length} passed`);
  process.exit(pass === cases.length ? 0 : 1);
}

// --- ESPN scoreboard ---------------------------------------------------------

// ESPN team name -> our canonical name (normalised keys). Extend if a fixture
// fails to match (the script logs any it can't resolve).
const TEAM_ALIASES = {
  bosniaherzegovina: 'Bosnia and Herzegovina',
  congodr: 'DR Congo',
  czechia: 'Czech Republic',
  turkiye: 'Turkey',
};

function canonicalApiTeam(name) {
  const n = norm(name);
  if (TEAM_ALIASES[n]) return norm(TEAM_ALIASES[n]);
  return n;
}

function pairKey(a, b) {
  return [a, b].sort().join('::');
}

// ISO yyyy-mm-dd -> compact yyyymmdd, shifted by `days` (UTC).
function isoToCompact(iso, days = 0) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

// ESPN buckets fixtures by UTC kickoff, so a venue-local date can land a day
// either side — query a window padded by a day and match on the team pair
// (each pair meets only once in the group stage).
async function fetchFinishedFixtures(minDate, maxDate) {
  const from = isoToCompact(minDate, -1);
  const to = isoToCompact(maxDate, 1);
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${from}-${to}&limit=500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN HTTP ${res.status}`);
  const data = await res.json();

  const finished = new Map(); // pairKey -> { hs, as, date }
  for (const event of data.events || []) {
    if (!event.status?.type?.completed) continue;
    const competitors = event.competitions?.[0]?.competitors || [];
    const home = competitors.find((c) => c.homeAway === 'home');
    const away = competitors.find((c) => c.homeAway === 'away');
    if (!home || !away) continue;
    const hs = Number(home.score);
    const as = Number(away.score);
    if (Number.isNaN(hs) || Number.isNaN(as)) continue;
    finished.set(
      pairKey(
        canonicalApiTeam(home.team.displayName),
        canonicalApiTeam(away.team.displayName),
      ),
      { hs, as, date: event.date },
    );
  }
  return finished;
}

// --- Historical predictions --------------------------------------------------

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The betting feed only covers upcoming fixtures, but content/matches.ts holds
// our predicted winner (`tip`) for every game. For fixtures that predate the
// feed (already played), turn that tip into a "Match Result" pick so the games
// we predicted before the feed existed still get graded into the track record.
async function historicalPredictions(beforeDate) {
  let text;
  try {
    text = await readFile(MATCHES_FILE, 'utf8');
  } catch {
    return [];
  }
  const re =
    /date: '([^']+)', home: '([^']+)', away: '([^']+)', homeScore: \d+, awayScore: \d+, tip: '([^']+)', probability: (\d+)/g;
  const picks = [];
  let m;
  while ((m = re.exec(text))) {
    const [, date, home, away, tip, probStr] = m;
    if (beforeDate && date >= beforeDate) continue;
    const probability = Number(probStr) / 100;
    picks.push({
      id: `${date}-${slugify(home)}-vs-${slugify(away)}-match-result-${slugify(tip)}-to-win`,
      date,
      match: `${home} vs ${away}`,
      home_team: home,
      away_team: away,
      market: 'Match Result',
      selection: `${tip} to win`,
      probability,
      odds: Math.round((1 / probability) * 100) / 100,
    });
  }
  return picks;
}

// --- Archive + grade ---------------------------------------------------------

async function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, 'utf8'));
}

function archivePicks(bets, archive) {
  const singles = new Map(archive.singles.map((s) => [s.id, s]));
  const multis = new Map(archive.multis.map((m) => [m.id, m]));
  for (const s of bets.singles) if (!singles.has(s.id)) singles.set(s.id, s);
  for (const m of bets.multis) if (!multis.has(m.id)) multis.set(m.id, m);
  return {
    singles: [...singles.values()],
    multis: [...multis.values()],
  };
}

function lookupScore(finished, home, away) {
  return finished.get(pairKey(norm(home), norm(away)));
}

function gradeArchive(archive, finished, today) {
  const unmatched = new Set();
  // Only flag a missing score as a problem once the fixture is in the past —
  // future fixtures are simply pending, not a matching failure.
  const flagMissing = (date, home, away) => {
    if (date < today) unmatched.add(`${date} ${home} v ${away}`);
  };

  const singles = archive.singles.map((s) => {
    const score = lookupScore(finished, s.home_team, s.away_team);
    if (!score) {
      flagMissing(s.date, s.home_team, s.away_team);
      return { ...s, result: 'pending' };
    }
    return {
      ...s,
      homeScore: score.hs,
      awayScore: score.as,
      result: gradeSelection(s.market, s.selection, s.home_team, s.away_team, score.hs, score.as),
    };
  });

  const multis = archive.multis.map((m) => {
    let anyPending = false;
    let anyLost = false;
    const legs = m.legs.map((leg) => {
      const score = lookupScore(finished, leg.home_team, leg.away_team);
      if (!score) {
        anyPending = true;
        flagMissing(leg.date, leg.home_team, leg.away_team);
        return { ...leg, result: 'pending' };
      }
      const r = gradeSelection(leg.market, leg.selection, leg.home_team, leg.away_team, score.hs, score.as);
      if (r === 'lost') anyLost = true;
      return { ...leg, homeScore: score.hs, awayScore: score.as, result: r };
    });
    const result = anyLost ? 'lost' : anyPending ? 'pending' : 'won';
    return { ...m, legs, result };
  });

  return { singles, multis, unmatched: [...unmatched] };
}

function summarise(singles) {
  const settled = singles.filter((s) => s.result === 'won' || s.result === 'lost');
  const won = settled.filter((s) => s.result === 'won').length;
  const lost = settled.filter((s) => s.result === 'lost').length;
  return {
    settled: settled.length,
    won,
    lost,
    hitRate: settled.length ? won / settled.length : 0,
  };
}

async function main() {
  if (process.argv.includes('--selftest')) return selftest();

  const bets = await readJson(BETS_FILE, { games: [], multis: [] });
  const prevArchive = await readJson(ARCHIVE_FILE, { singles: [], multis: [] });
  const excludedDoc = await readJson(EXCLUDED_FILE, { ids: [] });
  const excluded = new Set(excludedDoc.ids || []);
  const keep = (item) => !excluded.has(item.id);

  const feedSingles = (bets.games || []).flatMap(gameToBets);

  // Earliest fixture in the betting feed — anything before it is a past game
  // whose only record is our predicted winner in matches.ts.
  const minBetDate = feedSingles.reduce(
    (min, s) => (!min || s.date < min ? s.date : min),
    null,
  );
  const historical = await historicalPredictions(minBetDate);

  // Drop excluded picks everywhere, including any already in the archive.
  const archive = archivePicks(
    {
      singles: [...feedSingles, ...historical].filter(keep),
      multis: (bets.multis || []).filter(keep),
    },
    {
      singles: prevArchive.singles.filter(keep),
      multis: prevArchive.multis.filter(keep),
    },
  );
  await writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2) + '\n');
  console.log(
    `archived ${archive.singles.length} singles (${historical.length} historical), ${archive.multis.length} multis`,
  );

  const dates = archive.singles.map((s) => s.date).sort();
  if (dates.length === 0) {
    console.warn('No picks to grade.');
    return;
  }

  let finished;
  try {
    finished = await fetchFinishedFixtures(dates[0], dates[dates.length - 1]);
  } catch (err) {
    console.error(`Results fetch failed: ${err.message}. Leaving existing results file unchanged.`);
    process.exitCode = 0;
    return;
  }
  console.log(`fetched ${finished.size} finished fixtures`);

  const today = new Date().toISOString().slice(0, 10);
  const graded = gradeArchive(archive, finished, today);
  if (graded.unmatched.length) {
    console.warn(`Past fixtures with no matched score (add a TEAM_ALIASES entry?):`);
    for (const u of graded.unmatched) console.warn(`  - ${u}`);
  }

  const results = {
    updated: new Date().toISOString(),
    summary: summarise(graded.singles),
    singles: graded.singles,
    multis: graded.multis,
  };
  await writeFile(RESULTS_FILE, JSON.stringify(results, null, 2) + '\n');
  console.log(
    `wrote results: ${results.summary.won}/${results.summary.settled} singles landed`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
