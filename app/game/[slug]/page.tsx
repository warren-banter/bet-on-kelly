import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  matches,
  getMatchBySlug,
  formatMatchDate,
} from '@/content/matches';
import {
  getMatchBets,
  formatProbability,
  formatOdds,
} from '@/content/bets';
import { SITE_NAME, SITE_URL } from '@/content/config';
import Flag from '@/components/Flag';
import PredictButton from '@/components/PredictButton';

export function generateStaticParams() {
  return matches.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = getMatchBySlug(slug);
  if (!match) return {};

  const top = getMatchBets(match)[0];
  const title = `${match.home} vs ${match.away} betting prediction`;
  const description = top
    ? `Our World Cup 2026 pick for ${match.home} vs ${match.away}: ${top.selection} (${top.market}) at ${formatOdds(top.odds)} — ${formatProbability(top.probability)} probability.`
    : `World Cup 2026 match details for ${match.home} vs ${match.away}: kick-off time, venue and group-stage information.`;
  const url = `/game/${match.slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${title} — ${SITE_NAME}`,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}

function TeamBlock({ name }: { name: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <Flag country={name} className="h-9 w-14" />
      <span className="text-lg font-bold leading-tight text-ink">{name}</span>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-none">
      <dt className="text-sm font-medium text-ink-soft">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = getMatchBySlug(slug);
  if (!match) notFound();

  const dateLabel = formatMatchDate(match.date);
  const bets = getMatchBets(match);
  const top = bets[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home} vs ${match.away}`,
    sport: 'Soccer',
    startDate: match.date,
    url: `${SITE_URL}/game/${match.slug}/`,
    competitor: [
      { '@type': 'SportsTeam', name: match.home },
      { '@type': 'SportsTeam', name: match.away },
    ],
    superEvent: { '@type': 'SportsEvent', name: 'FIFA World Cup 2026' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-accent hover:underline"
          >
            &larr; All games
          </Link>
        </nav>

        <p className="text-sm font-medium text-ink-soft">{dateLabel}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {match.home} vs {match.away}
        </h1>

        {/* Matchup */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <TeamBlock name={match.home} />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              v
            </span>
            <TeamBlock name={match.away} />
          </div>

          {/* Top pick */}
          {top ? (
            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/10 p-4 text-center">
              <p className="text-sm text-ink-soft">
                Top pick &middot; {top.market}
              </p>
              <p className="mt-1 text-xl font-extrabold text-accent">
                {top.selection}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold tabular-nums text-black">
                  {formatOdds(top.odds)}
                </span>
                <span className="text-sm font-semibold tabular-nums text-ink-soft">
                  {formatProbability(top.probability)} probability
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-line bg-page p-4 text-center">
              <p className="text-sm text-ink-soft">
                No active bets for this fixture.
              </p>
            </div>
          )}

          <PredictButton size="lg" className="mt-6 w-full" />
        </div>

        {/* All picks */}
        {bets.length > 1 && (
          <section className="mt-8">
            <h2 className="mb-2 text-base font-bold text-ink">
              All picks ({bets.length})
            </h2>
            <div className="space-y-2">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                      {bet.market}
                    </p>
                    <p className="truncate text-sm font-semibold text-ink">
                      {bet.selection}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-medium tabular-nums text-ink-soft">
                      {formatProbability(bet.probability)}
                    </span>
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-sm font-bold tabular-nums text-accent">
                      {formatOdds(bet.odds)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Structured facts */}
        <section className="mt-8">
          <h2 className="mb-2 text-base font-bold text-ink">Match facts</h2>
          <dl className="rounded-2xl border border-line bg-surface px-5 py-2 shadow-sm">
            <Fact label="Competition" value="FIFA World Cup 2026" />
            <Fact label="Stage" value="Group stage" />
            <Fact label="Date" value={dateLabel} />
            <Fact label="Kick-off" value={match.time} />
            <Fact label="Venue" value={match.venue} />
            <Fact label="Home" value={match.home} />
            <Fact label="Away" value={match.away} />
            {top && (
              <Fact
                label="Top pick"
                value={`${top.selection} @ ${formatOdds(top.odds)}`}
              />
            )}
          </dl>
        </section>
      </article>
    </>
  );
}
