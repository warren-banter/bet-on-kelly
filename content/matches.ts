// World Cup 2026 fixtures. Group-stage games are encoded statically below
// (source: Predictions.txt); knockout fixtures are derived from the betting feed
// (content/wc_bets.json), so any tie added to the feed shows up automatically.
import betsData from './wc_bets.json';

export interface Match {
  slug: string;
  date: string; // ISO date, e.g. "2026-06-11"
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  tip: string; // team predicted to win
  probability: number; // win probability for the tipped team, as a percentage
  time: string; // local kickoff, e.g. "1:00 PM CST"
  venue: string; // host city, e.g. "Mexico City"
  round?: string; // knockout round, e.g. "Round of 32"; undefined for the group stage
}

// Country name -> ISO 3166-1 alpha-2 (or flag-icons sub-region code).
// Drives the SVG flag sprites from `flag-icons` (these are SVGs, not emoji).
export const countryToISO: Record<string, string> = {
  Mexico: 'mx',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Czech Republic': 'cz',
  Canada: 'ca',
  'Bosnia and Herzegovina': 'ba',
  'United States': 'us',
  Paraguay: 'py',
  Qatar: 'qa',
  Switzerland: 'ch',
  Brazil: 'br',
  Morocco: 'ma',
  Haiti: 'ht',
  Scotland: 'gb-sct',
  Australia: 'au',
  Turkey: 'tr',
  Germany: 'de',
  'Curaçao': 'cw',
  'Ivory Coast': 'ci',
  Ecuador: 'ec',
  Netherlands: 'nl',
  Japan: 'jp',
  Sweden: 'se',
  Tunisia: 'tn',
  Belgium: 'be',
  Egypt: 'eg',
  Iran: 'ir',
  'New Zealand': 'nz',
  Spain: 'es',
  'Cape Verde': 'cv',
  'Saudi Arabia': 'sa',
  Uruguay: 'uy',
  France: 'fr',
  Senegal: 'sn',
  Iraq: 'iq',
  Norway: 'no',
  Argentina: 'ar',
  Algeria: 'dz',
  Austria: 'at',
  Jordan: 'jo',
  Portugal: 'pt',
  'DR Congo': 'cd',
  Uzbekistan: 'uz',
  Colombia: 'co',
  England: 'gb-eng',
  Croatia: 'hr',
  Ghana: 'gh',
  Panama: 'pa',
};

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (e.g. Curaçao -> Curacao)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface RawMatch {
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  tip: string;
  probability: number;
}

const raw: RawMatch[] = [
  { date: '2026-06-11', home: 'Mexico', away: 'South Africa', homeScore: 1, awayScore: 0, tip: 'Mexico', probability: 70 },
  { date: '2026-06-11', home: 'South Korea', away: 'Czech Republic', homeScore: 1, awayScore: 0, tip: 'South Korea', probability: 46 },
  { date: '2026-06-12', home: 'Canada', away: 'Bosnia and Herzegovina', homeScore: 2, awayScore: 0, tip: 'Canada', probability: 66 },
  { date: '2026-06-12', home: 'United States', away: 'Paraguay', homeScore: 1, awayScore: 0, tip: 'United States', probability: 54 },
  { date: '2026-06-13', home: 'Qatar', away: 'Switzerland', homeScore: 0, awayScore: 2, tip: 'Switzerland', probability: 69 },
  { date: '2026-06-13', home: 'Brazil', away: 'Morocco', homeScore: 1, awayScore: 0, tip: 'Brazil', probability: 51 },
  { date: '2026-06-13', home: 'Haiti', away: 'Scotland', homeScore: 1, awayScore: 2, tip: 'Scotland', probability: 55 },
  { date: '2026-06-13', home: 'Australia', away: 'Turkey', homeScore: 1, awayScore: 2, tip: 'Turkey', probability: 39 },
  { date: '2026-06-14', home: 'Germany', away: 'Curaçao', homeScore: 3, awayScore: 1, tip: 'Germany', probability: 82 },
  { date: '2026-06-14', home: 'Ivory Coast', away: 'Ecuador', homeScore: 0, awayScore: 1, tip: 'Ecuador', probability: 41 },
  { date: '2026-06-14', home: 'Netherlands', away: 'Japan', homeScore: 1, awayScore: 0, tip: 'Netherlands', probability: 41 },
  { date: '2026-06-14', home: 'Sweden', away: 'Tunisia', homeScore: 1, awayScore: 0, tip: 'Sweden', probability: 42 },
  { date: '2026-06-15', home: 'Belgium', away: 'Egypt', homeScore: 1, awayScore: 0, tip: 'Belgium', probability: 53 },
  { date: '2026-06-15', home: 'Iran', away: 'New Zealand', homeScore: 1, awayScore: 0, tip: 'Iran', probability: 46 },
  { date: '2026-06-15', home: 'Spain', away: 'Cape Verde', homeScore: 3, awayScore: 0, tip: 'Spain', probability: 85 },
  { date: '2026-06-15', home: 'Saudi Arabia', away: 'Uruguay', homeScore: 0, awayScore: 1, tip: 'Uruguay', probability: 61 },
  { date: '2026-06-16', home: 'France', away: 'Senegal', homeScore: 1, awayScore: 0, tip: 'France', probability: 58 },
  { date: '2026-06-16', home: 'Iraq', away: 'Norway', homeScore: 1, awayScore: 2, tip: 'Norway', probability: 63 },
  { date: '2026-06-16', home: 'Argentina', away: 'Algeria', homeScore: 1, awayScore: 0, tip: 'Argentina', probability: 68 },
  { date: '2026-06-16', home: 'Austria', away: 'Jordan', homeScore: 2, awayScore: 1, tip: 'Austria', probability: 59 },
  { date: '2026-06-17', home: 'Portugal', away: 'DR Congo', homeScore: 1, awayScore: 0, tip: 'Portugal', probability: 68 },
  { date: '2026-06-17', home: 'Uzbekistan', away: 'Colombia', homeScore: 0, awayScore: 1, tip: 'Colombia', probability: 60 },
  { date: '2026-06-17', home: 'England', away: 'Croatia', homeScore: 1, awayScore: 0, tip: 'England', probability: 53 },
  { date: '2026-06-17', home: 'Ghana', away: 'Panama', homeScore: 1, awayScore: 0, tip: 'Ghana', probability: 38 },
  { date: '2026-06-18', home: 'Czech Republic', away: 'South Africa', homeScore: 1, awayScore: 0, tip: 'Czech Republic', probability: 43 },
  { date: '2026-06-18', home: 'Mexico', away: 'South Korea', homeScore: 1, awayScore: 0, tip: 'Mexico', probability: 53 },
  { date: '2026-06-18', home: 'Switzerland', away: 'Bosnia and Herzegovina', homeScore: 1, awayScore: 0, tip: 'Switzerland', probability: 65 },
  { date: '2026-06-18', home: 'Canada', away: 'Qatar', homeScore: 2, awayScore: 0, tip: 'Canada', probability: 73 },
  { date: '2026-06-19', home: 'Scotland', away: 'Morocco', homeScore: 0, awayScore: 1, tip: 'Morocco', probability: 54 },
  { date: '2026-06-19', home: 'Brazil', away: 'Haiti', homeScore: 3, awayScore: 0, tip: 'Brazil', probability: 85 },
  { date: '2026-06-19', home: 'United States', away: 'Australia', homeScore: 1, awayScore: 0, tip: 'United States', probability: 49 },
  { date: '2026-06-19', home: 'Turkey', away: 'Paraguay', homeScore: 1, awayScore: 0, tip: 'Turkey', probability: 40 },
  { date: '2026-06-20', home: 'Germany', away: 'Ivory Coast', homeScore: 1, awayScore: 0, tip: 'Germany', probability: 58 },
  { date: '2026-06-20', home: 'Ecuador', away: 'Curaçao', homeScore: 2, awayScore: 0, tip: 'Ecuador', probability: 70 },
  { date: '2026-06-20', home: 'Netherlands', away: 'Sweden', homeScore: 1, awayScore: 0, tip: 'Netherlands', probability: 58 },
  { date: '2026-06-20', home: 'Tunisia', away: 'Japan', homeScore: 0, awayScore: 1, tip: 'Japan', probability: 53 },
  { date: '2026-06-21', home: 'Belgium', away: 'Iran', homeScore: 2, awayScore: 1, tip: 'Belgium', probability: 55 },
  { date: '2026-06-21', home: 'New Zealand', away: 'Egypt', homeScore: 0, awayScore: 1, tip: 'Egypt', probability: 45 },
  { date: '2026-06-21', home: 'Spain', away: 'Saudi Arabia', homeScore: 2, awayScore: 0, tip: 'Spain', probability: 79 },
  { date: '2026-06-21', home: 'Uruguay', away: 'Cape Verde', homeScore: 1, awayScore: 0, tip: 'Uruguay', probability: 67 },
  { date: '2026-06-22', home: 'France', away: 'Iraq', homeScore: 2, awayScore: 0, tip: 'France', probability: 75 },
  { date: '2026-06-22', home: 'Norway', away: 'Senegal', homeScore: 1, awayScore: 0, tip: 'Norway', probability: 38 },
  { date: '2026-06-22', home: 'Argentina', away: 'Austria', homeScore: 1, awayScore: 0, tip: 'Argentina', probability: 63 },
  { date: '2026-06-22', home: 'Jordan', away: 'Algeria', homeScore: 0, awayScore: 1, tip: 'Algeria', probability: 51 },
  { date: '2026-06-23', home: 'Portugal', away: 'Uzbekistan', homeScore: 2, awayScore: 0, tip: 'Portugal', probability: 65 },
  { date: '2026-06-23', home: 'Colombia', away: 'DR Congo', homeScore: 1, awayScore: 0, tip: 'Colombia', probability: 63 },
  { date: '2026-06-23', home: 'England', away: 'Ghana', homeScore: 2, awayScore: 0, tip: 'England', probability: 70 },
  { date: '2026-06-23', home: 'Panama', away: 'Croatia', homeScore: 0, awayScore: 1, tip: 'Croatia', probability: 55 },
  { date: '2026-06-24', home: 'Mexico', away: 'Czech Republic', homeScore: 1, awayScore: 0, tip: 'Mexico', probability: 62 },
  { date: '2026-06-24', home: 'South Africa', away: 'South Korea', homeScore: 0, awayScore: 1, tip: 'South Korea', probability: 52 },
  { date: '2026-06-24', home: 'Canada', away: 'Switzerland', homeScore: 1, awayScore: 0, tip: 'Canada', probability: 38 },
  { date: '2026-06-24', home: 'Bosnia and Herzegovina', away: 'Qatar', homeScore: 2, awayScore: 1, tip: 'Bosnia and Herzegovina', probability: 44 },
  { date: '2026-06-24', home: 'Scotland', away: 'Brazil', homeScore: 0, awayScore: 2, tip: 'Brazil', probability: 71 },
  { date: '2026-06-24', home: 'Morocco', away: 'Haiti', homeScore: 2, awayScore: 0, tip: 'Morocco', probability: 71 },
  { date: '2026-06-25', home: 'United States', away: 'Turkey', homeScore: 2, awayScore: 1, tip: 'United States', probability: 50 },
  { date: '2026-06-25', home: 'Paraguay', away: 'Australia', homeScore: 0, awayScore: 1, tip: 'Australia', probability: 37 },
  { date: '2026-06-25', home: 'Curaçao', away: 'Ivory Coast', homeScore: 0, awayScore: 1, tip: 'Ivory Coast', probability: 62 },
  { date: '2026-06-25', home: 'Ecuador', away: 'Germany', homeScore: 0, awayScore: 1, tip: 'Germany', probability: 49 },
  { date: '2026-06-25', home: 'Japan', away: 'Sweden', homeScore: 1, awayScore: 0, tip: 'Japan', probability: 53 },
  { date: '2026-06-25', home: 'Tunisia', away: 'Netherlands', homeScore: 0, awayScore: 1, tip: 'Netherlands', probability: 58 },
  { date: '2026-06-26', home: 'Egypt', away: 'Iran', homeScore: 0, awayScore: 1, tip: 'Iran', probability: 35 },
  { date: '2026-06-26', home: 'New Zealand', away: 'Belgium', homeScore: 1, awayScore: 2, tip: 'Belgium', probability: 62 },
  { date: '2026-06-26', home: 'Cape Verde', away: 'Saudi Arabia', homeScore: 0, awayScore: 1, tip: 'Saudi Arabia', probability: 39 },
  { date: '2026-06-26', home: 'Uruguay', away: 'Spain', homeScore: 0, awayScore: 1, tip: 'Spain', probability: 53 },
  { date: '2026-06-26', home: 'Norway', away: 'France', homeScore: 0, awayScore: 1, tip: 'France', probability: 55 },
  { date: '2026-06-26', home: 'Senegal', away: 'Iraq', homeScore: 1, awayScore: 0, tip: 'Senegal', probability: 58 },
  { date: '2026-06-27', home: 'Algeria', away: 'Austria', homeScore: 0, awayScore: 1, tip: 'Austria', probability: 38 },
  { date: '2026-06-27', home: 'Jordan', away: 'Argentina', homeScore: 0, awayScore: 2, tip: 'Argentina', probability: 77 },
  { date: '2026-06-27', home: 'Colombia', away: 'Portugal', homeScore: 0, awayScore: 1, tip: 'Portugal', probability: 40 },
  { date: '2026-06-27', home: 'DR Congo', away: 'Uzbekistan', homeScore: 0, awayScore: 1, tip: 'Uzbekistan', probability: 36 },
  { date: '2026-06-27', home: 'Panama', away: 'England', homeScore: 0, awayScore: 2, tip: 'England', probability: 69 },
  { date: '2026-06-27', home: 'Croatia', away: 'Ghana', homeScore: 1, awayScore: 0, tip: 'Croatia', probability: 54 },
];

// Kickoff times and host cities from the official 2026 World Cup schedule.
// Our fixtures match the real draw, so each entry is keyed by date + the two teams
// (order-independent). Times are local to the venue.
// Source: Al Jazeera "World Cup 2026 full match schedule" (aljazeera.com), June 2026.
interface ScheduleEntry {
  date: string;
  teams: [string, string];
  time: string;
  venue: string;
}

const schedule: ScheduleEntry[] = [
  { date: '2026-06-11', teams: ['Mexico', 'South Africa'], time: '1:00 PM CST', venue: 'Mexico City' },
  { date: '2026-06-11', teams: ['South Korea', 'Czech Republic'], time: '8:00 PM CST', venue: 'Guadalajara' },
  { date: '2026-06-12', teams: ['Canada', 'Bosnia and Herzegovina'], time: '3:00 PM ET', venue: 'Toronto' },
  { date: '2026-06-12', teams: ['United States', 'Paraguay'], time: '6:00 PM PT', venue: 'Los Angeles' },
  { date: '2026-06-13', teams: ['Qatar', 'Switzerland'], time: '12:00 PM PT', venue: 'San Francisco' },
  { date: '2026-06-13', teams: ['Brazil', 'Morocco'], time: '6:00 PM ET', venue: 'New Jersey' },
  { date: '2026-06-13', teams: ['Haiti', 'Scotland'], time: '9:00 PM ET', venue: 'Boston' },
  { date: '2026-06-13', teams: ['Australia', 'Turkey'], time: '6:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-14', teams: ['Germany', 'Curaçao'], time: '12:00 PM CDT', venue: 'Houston' },
  { date: '2026-06-14', teams: ['Netherlands', 'Japan'], time: '3:00 PM CDT', venue: 'Dallas' },
  { date: '2026-06-14', teams: ['Ivory Coast', 'Ecuador'], time: '7:00 PM ET', venue: 'Philadelphia' },
  { date: '2026-06-14', teams: ['Sweden', 'Tunisia'], time: '8:00 PM CST', venue: 'Monterrey' },
  { date: '2026-06-15', teams: ['Spain', 'Cape Verde'], time: '12:00 PM ET', venue: 'Atlanta' },
  { date: '2026-06-15', teams: ['Belgium', 'Egypt'], time: '12:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-15', teams: ['Saudi Arabia', 'Uruguay'], time: '6:00 PM ET', venue: 'Miami' },
  { date: '2026-06-15', teams: ['Iran', 'New Zealand'], time: '6:00 PM PT', venue: 'Los Angeles' },
  { date: '2026-06-16', teams: ['France', 'Senegal'], time: '3:00 PM ET', venue: 'New Jersey' },
  { date: '2026-06-16', teams: ['Iraq', 'Norway'], time: '6:00 PM ET', venue: 'Boston' },
  { date: '2026-06-16', teams: ['Argentina', 'Algeria'], time: '8:00 PM CDT', venue: 'Kansas City' },
  { date: '2026-06-16', teams: ['Austria', 'Jordan'], time: '9:00 PM PT', venue: 'San Francisco' },
  { date: '2026-06-17', teams: ['Portugal', 'DR Congo'], time: '12:00 PM CDT', venue: 'Houston' },
  { date: '2026-06-17', teams: ['England', 'Croatia'], time: '3:00 PM CDT', venue: 'Dallas' },
  { date: '2026-06-17', teams: ['Ghana', 'Panama'], time: '7:00 PM ET', venue: 'Toronto' },
  { date: '2026-06-17', teams: ['Uzbekistan', 'Colombia'], time: '8:00 PM CST', venue: 'Mexico City' },
  { date: '2026-06-18', teams: ['Czech Republic', 'South Africa'], time: '12:00 PM ET', venue: 'Atlanta' },
  { date: '2026-06-18', teams: ['Switzerland', 'Bosnia and Herzegovina'], time: '12:00 PM PT', venue: 'Los Angeles' },
  { date: '2026-06-18', teams: ['Canada', 'Qatar'], time: '3:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-18', teams: ['Mexico', 'South Korea'], time: '7:00 PM CST', venue: 'Guadalajara' },
  { date: '2026-06-19', teams: ['Scotland', 'Morocco'], time: '6:00 PM ET', venue: 'Boston' },
  { date: '2026-06-19', teams: ['United States', 'Australia'], time: '12:00 PM PT', venue: 'Seattle' },
  { date: '2026-06-19', teams: ['Brazil', 'Haiti'], time: '8:30 PM ET', venue: 'Philadelphia' },
  { date: '2026-06-19', teams: ['Turkey', 'Paraguay'], time: '9:00 PM PT', venue: 'San Francisco' },
  { date: '2026-06-20', teams: ['Netherlands', 'Sweden'], time: '12:00 PM CDT', venue: 'Houston' },
  { date: '2026-06-20', teams: ['Germany', 'Ivory Coast'], time: '4:00 PM ET', venue: 'Toronto' },
  { date: '2026-06-20', teams: ['Ecuador', 'Curaçao'], time: '7:00 PM CDT', venue: 'Kansas City' },
  { date: '2026-06-20', teams: ['Tunisia', 'Japan'], time: '10:00 PM CST', venue: 'Monterrey' },
  { date: '2026-06-21', teams: ['Spain', 'Saudi Arabia'], time: '12:00 PM ET', venue: 'Atlanta' },
  { date: '2026-06-21', teams: ['Belgium', 'Iran'], time: '12:00 PM PT', venue: 'Los Angeles' },
  { date: '2026-06-21', teams: ['Uruguay', 'Cape Verde'], time: '6:00 PM ET', venue: 'Miami' },
  { date: '2026-06-21', teams: ['New Zealand', 'Egypt'], time: '6:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-22', teams: ['Argentina', 'Austria'], time: '12:00 PM CDT', venue: 'Dallas' },
  { date: '2026-06-22', teams: ['France', 'Iraq'], time: '5:00 PM ET', venue: 'Philadelphia' },
  { date: '2026-06-22', teams: ['Norway', 'Senegal'], time: '8:00 PM ET', venue: 'New Jersey' },
  { date: '2026-06-22', teams: ['Jordan', 'Algeria'], time: '8:00 PM PT', venue: 'San Francisco' },
  { date: '2026-06-23', teams: ['Portugal', 'Uzbekistan'], time: '12:00 PM CDT', venue: 'Houston' },
  { date: '2026-06-23', teams: ['England', 'Ghana'], time: '4:00 PM ET', venue: 'Boston' },
  { date: '2026-06-23', teams: ['Panama', 'Croatia'], time: '7:00 PM ET', venue: 'Toronto' },
  { date: '2026-06-23', teams: ['Colombia', 'DR Congo'], time: '8:00 PM CST', venue: 'Guadalajara' },
  { date: '2026-06-24', teams: ['Mexico', 'Czech Republic'], time: '7:00 PM CST', venue: 'Mexico City' },
  { date: '2026-06-24', teams: ['South Africa', 'South Korea'], time: '7:00 PM CST', venue: 'Monterrey' },
  { date: '2026-06-24', teams: ['Canada', 'Switzerland'], time: '12:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-24', teams: ['Bosnia and Herzegovina', 'Qatar'], time: '12:00 PM PT', venue: 'Seattle' },
  { date: '2026-06-24', teams: ['Scotland', 'Brazil'], time: '6:00 PM ET', venue: 'Miami' },
  { date: '2026-06-24', teams: ['Morocco', 'Haiti'], time: '6:00 PM ET', venue: 'Atlanta' },
  { date: '2026-06-25', teams: ['United States', 'Turkey'], time: '7:00 PM PT', venue: 'Los Angeles' },
  { date: '2026-06-25', teams: ['Paraguay', 'Australia'], time: '7:00 PM PT', venue: 'San Francisco' },
  { date: '2026-06-25', teams: ['Curaçao', 'Ivory Coast'], time: '4:00 PM ET', venue: 'Philadelphia' },
  { date: '2026-06-25', teams: ['Ecuador', 'Germany'], time: '4:00 PM ET', venue: 'New Jersey' },
  { date: '2026-06-25', teams: ['Japan', 'Sweden'], time: '6:00 PM CDT', venue: 'Dallas' },
  { date: '2026-06-25', teams: ['Tunisia', 'Netherlands'], time: '6:00 PM CDT', venue: 'Kansas City' },
  { date: '2026-06-26', teams: ['Egypt', 'Iran'], time: '8:00 PM PT', venue: 'Seattle' },
  { date: '2026-06-26', teams: ['New Zealand', 'Belgium'], time: '8:00 PM PT', venue: 'Vancouver' },
  { date: '2026-06-26', teams: ['Cape Verde', 'Saudi Arabia'], time: '7:00 PM CDT', venue: 'Houston' },
  { date: '2026-06-26', teams: ['Uruguay', 'Spain'], time: '6:00 PM CST', venue: 'Guadalajara' },
  { date: '2026-06-26', teams: ['Norway', 'France'], time: '3:00 PM ET', venue: 'Boston' },
  { date: '2026-06-26', teams: ['Senegal', 'Iraq'], time: '3:00 PM ET', venue: 'Toronto' },
  { date: '2026-06-27', teams: ['Algeria', 'Austria'], time: '9:00 PM CDT', venue: 'Kansas City' },
  { date: '2026-06-27', teams: ['Jordan', 'Argentina'], time: '9:00 PM CDT', venue: 'Dallas' },
  { date: '2026-06-27', teams: ['Colombia', 'Portugal'], time: '7:30 PM ET', venue: 'Miami' },
  { date: '2026-06-27', teams: ['DR Congo', 'Uzbekistan'], time: '7:30 PM ET', venue: 'Atlanta' },
  { date: '2026-06-27', teams: ['Panama', 'England'], time: '5:00 PM ET', venue: 'New Jersey' },
  { date: '2026-06-27', teams: ['Croatia', 'Ghana'], time: '5:00 PM ET', venue: 'Philadelphia' },
];

function scheduleKey(date: string, a: string, b: string): string {
  return `${date}|${[a, b].sort().join('::')}`;
}

const scheduleLookup = new Map(
  schedule.map((s) => [
    scheduleKey(s.date, s.teams[0], s.teams[1]),
    { time: s.time, venue: s.venue },
  ]),
);

export const matches: Match[] = raw.map((m) => {
  const sched = scheduleLookup.get(scheduleKey(m.date, m.home, m.away));
  return {
    ...m,
    slug: `${m.date}-${slugify(m.home)}-vs-${slugify(m.away)}`,
    time: sched?.time ?? 'TBC',
    venue: sched?.venue ?? 'TBC',
  };
});

// Knockout fixtures, derived from the betting feed (the games flagged
// stage: "knockout"). Kept separate from `matches` (the group-stage array) so the
// group-table derivation in groups() — which treats every fixture as a same-group
// meeting — is never fed a cross-group knockout tie. Picks join by date + teams,
// exactly as for the group stage. Adding a tie to wc_bets.json surfaces it here
// automatically; kick-off times and venues follow once the schedule is confirmed.
interface RawFeedGame {
  id: string;
  date: string;
  home_team: string;
  away_team: string;
  stage?: string;
}

// Knockout round name for a date, by the 2026 FIFA schedule windows.
function knockoutRound(date: string): string {
  if (date <= '2026-07-03') return 'Round of 32';
  if (date <= '2026-07-07') return 'Round of 16';
  if (date <= '2026-07-11') return 'Quarter-final';
  if (date <= '2026-07-15') return 'Semi-final';
  return 'Final';
}

// Knockout fixtures carry no score or group-stage tip — the pick is in the feed.
export const knockoutMatches: Match[] = (betsData.games as RawFeedGame[])
  .filter((g) => g.stage === 'knockout')
  .map((g) => ({
    date: g.date,
    home: g.home_team,
    away: g.away_team,
    homeScore: 0,
    awayScore: 0,
    tip: '',
    probability: 0,
    slug: `${g.date}-${slugify(g.home_team)}-vs-${slugify(g.away_team)}`,
    time: 'TBC',
    venue: 'TBC',
    round: knockoutRound(g.date),
  }))
  .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));

// Every fixture that has a static match page (group stage + knockouts).
export const allMatches: Match[] = [...matches, ...knockoutMatches];

export function getMatchBySlug(slug: string): Match | undefined {
  return allMatches.find((m) => m.slug === slug);
}

export interface MatchDay {
  date: string;
  label: string; // e.g. "Thursday 11 June 2026"
  matches: Match[];
}

export function formatMatchDate(date: string): string {
  // Parse as a fixed UTC date so the label never shifts with the build machine's timezone.
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export interface GroupStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number; // goals for
  ga: number; // goals against
  gd: number; // goal difference
  points: number;
}

export interface Group {
  name: string; // "Group A"
  teams: string[];
  matches: Match[];
  standings: GroupStanding[];
}

function computeStandings(teams: string[], ms: Match[]): GroupStanding[] {
  const table = new Map<string, GroupStanding>();
  for (const t of teams) {
    table.set(t, {
      team: t,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    });
  }

  for (const m of ms) {
    const home = table.get(m.home)!;
    const away = table.get(m.away)!;
    home.played++;
    away.played++;
    home.gf += m.homeScore;
    home.ga += m.awayScore;
    away.gf += m.awayScore;
    away.ga += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.won++;
      away.lost++;
      home.points += 3;
    } else if (m.homeScore < m.awayScore) {
      away.won++;
      home.lost++;
      away.points += 3;
    } else {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    }
  }

  for (const s of table.values()) s.gd = s.gf - s.ga;

  return Array.from(table.values()).sort(
    (a, b) =>
      b.points - a.points ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team),
  );
}

// Groups are derived from the fixtures: during the group stage, teams only play
// the other three sides in their group, so each connected cluster of opponents is
// one group of four. Letters are assigned by order of first appearance in the data.
export function groups(): Group[] {
  const adjacency = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    adjacency.get(a)!.add(b);
  };
  for (const m of matches) {
    link(m.home, m.away);
    link(m.away, m.home);
  }

  // Stable team order = order of first appearance in the fixture list.
  const order: string[] = [];
  for (const m of matches) {
    for (const t of [m.home, m.away]) {
      if (!order.includes(t)) order.push(t);
    }
  }

  const seen = new Set<string>();
  const clusters: string[][] = [];
  for (const start of order) {
    if (seen.has(start)) continue;
    const stack = [start];
    const cluster: string[] = [];
    seen.add(start);
    while (stack.length) {
      const current = stack.pop()!;
      cluster.push(current);
      for (const neighbour of adjacency.get(current) ?? []) {
        if (!seen.has(neighbour)) {
          seen.add(neighbour);
          stack.push(neighbour);
        }
      }
    }
    clusters.push(cluster);
  }

  return clusters.map((teams, i) => {
    const groupMatches = matches
      .filter((m) => teams.includes(m.home) && teams.includes(m.away))
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      name: `Group ${String.fromCharCode(65 + i)}`,
      teams,
      matches: groupMatches,
      standings: computeStandings(teams, groupMatches),
    };
  });
}

function groupByDate(list: Match[]): MatchDay[] {
  const days = new Map<string, Match[]>();
  for (const m of list) {
    const dayList = days.get(m.date) ?? [];
    dayList.push(m);
    days.set(m.date, dayList);
  }
  return Array.from(days.keys())
    .sort()
    .map((date) => ({
      date,
      label: formatMatchDate(date),
      matches: days.get(date)!,
    }));
}

export function matchesByDate(): MatchDay[] {
  return groupByDate(matches);
}

export function knockoutMatchesByDate(): MatchDay[] {
  return groupByDate(knockoutMatches);
}

// Approximate minutes-from-midnight (venue-local, normalised to UTC) for ordering
// fixtures within a day by real kickoff. Mexican venues use CST (-6); US Central CDT (-5);
// Eastern ET (-4, EDT in June); Pacific PT (-7, PDT in June).
const TZ_OFFSET: Record<string, number> = { ET: -4, CDT: -5, CST: -6, PT: -7 };

function kickoffSortKey(time: string): number {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)\s*([A-Z]+)$/i);
  if (!m) return Number.MAX_SAFE_INTEGER; // TBC sorts last
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  if (m[3].toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (m[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
  const offset = TZ_OFFSET[m[4].toUpperCase()] ?? 0;
  return hour * 60 + minute - offset * 60; // UTC-equivalent minutes
}

// Fixtures grouped by date, ordered within each day by real kickoff time.
export function fixturesByDate(): MatchDay[] {
  return matchesByDate().map((day) => ({
    ...day,
    matches: [...day.matches].sort(
      (a, b) => kickoffSortKey(a.time) - kickoffSortKey(b.time),
    ),
  }));
}

// ---- Team helpers --------------------------------------------------------

export function teamSlug(team: string): string {
  return slugify(team);
}

export function allTeams(): string[] {
  const set = new Set<string>();
  for (const m of matches) {
    set.add(m.home);
    set.add(m.away);
  }
  return Array.from(set).sort();
}

export function getTeamBySlug(slug: string): string | undefined {
  return allTeams().find((t) => teamSlug(t) === slug);
}

export interface TeamMatch {
  match: Match;
  opponent: string;
  home: boolean;
  forScore: number;
  againstScore: number;
  result: 'W' | 'D' | 'L';
}

export function getTeamMatches(team: string): TeamMatch[] {
  return matches
    .filter((m) => m.home === team || m.away === team)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((match) => {
      const isHome = match.home === team;
      const forScore = isHome ? match.homeScore : match.awayScore;
      const againstScore = isHome ? match.awayScore : match.homeScore;
      const result: 'W' | 'D' | 'L' =
        forScore > againstScore ? 'W' : forScore < againstScore ? 'L' : 'D';
      return {
        match,
        opponent: isHome ? match.away : match.home,
        home: isHome,
        forScore,
        againstScore,
        result,
      };
    });
}

// The group a team belongs to (with its full standings), or undefined.
export function getTeamGroup(team: string): Group | undefined {
  return groups().find((g) => g.teams.includes(team));
}
