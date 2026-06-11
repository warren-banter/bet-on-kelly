// Past FIFA World Cup winners. Used by the home hero — hovering the ball
// cycles through these. West Germany uses the modern German flag (iso "de").

export interface Champion {
  year: number;
  country: string;
  iso: string; // flag-icons code
}

export const champions: Champion[] = [
  { year: 1930, country: 'Uruguay', iso: 'uy' },
  { year: 1934, country: 'Italy', iso: 'it' },
  { year: 1938, country: 'Italy', iso: 'it' },
  { year: 1950, country: 'Uruguay', iso: 'uy' },
  { year: 1954, country: 'West Germany', iso: 'de' },
  { year: 1958, country: 'Brazil', iso: 'br' },
  { year: 1962, country: 'Brazil', iso: 'br' },
  { year: 1966, country: 'England', iso: 'gb-eng' },
  { year: 1970, country: 'Brazil', iso: 'br' },
  { year: 1974, country: 'West Germany', iso: 'de' },
  { year: 1978, country: 'Argentina', iso: 'ar' },
  { year: 1982, country: 'Italy', iso: 'it' },
  { year: 1986, country: 'Argentina', iso: 'ar' },
  { year: 1990, country: 'West Germany', iso: 'de' },
  { year: 1994, country: 'Brazil', iso: 'br' },
  { year: 1998, country: 'France', iso: 'fr' },
  { year: 2002, country: 'Brazil', iso: 'br' },
  { year: 2006, country: 'Italy', iso: 'it' },
  { year: 2010, country: 'Spain', iso: 'es' },
  { year: 2014, country: 'Germany', iso: 'de' },
  { year: 2018, country: 'France', iso: 'fr' },
  { year: 2022, country: 'Argentina', iso: 'ar' },
];

// Most decorated nations, derived for the hero subtitle.
export const titleCount: { country: string; iso: string; titles: number }[] = [
  { country: 'Brazil', iso: 'br', titles: 5 },
  { country: 'Germany', iso: 'de', titles: 4 },
  { country: 'Italy', iso: 'it', titles: 4 },
  { country: 'Argentina', iso: 'ar', titles: 3 },
];
