import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  matches,
  getMatchBySlug,
  formatMatchDate,
} from '@/content/matches';
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

  const title = `${match.home} vs ${match.away} prediction`;
  const description = `Our World Cup 2026 prediction for ${match.home} vs ${match.away}: ${match.tip} to win (${match.probability}%), predicted score ${match.homeScore}-${match.awayScore}.`;
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
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                Predicted
              </span>
              <span className="text-4xl font-bold tabular-nums leading-none text-ink">
                {match.homeScore}
                <span className="mx-1.5 text-ink-soft">-</span>
                {match.awayScore}
              </span>
            </div>
            <TeamBlock name={match.away} />
          </div>

          {/* Tip / confidence block */}
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/10 p-4 text-center">
            <p className="text-sm text-ink-soft">Our tip</p>
            <p className="mt-1 text-xl font-extrabold text-accent">
              {match.tip} to win
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-raised">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${match.probability}%` }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums text-accent">
                {match.probability}%
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Win probability</p>
          </div>

          <PredictButton size="lg" className="mt-6 w-full" />
        </div>

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
            <Fact
              label="Predicted score"
              value={`${match.home} ${match.homeScore}-${match.awayScore} ${match.away}`}
            />
            <Fact label="Predicted winner" value={match.tip} />
            <Fact label="Win probability" value={`${match.probability}%`} />
          </dl>
        </section>
      </article>
    </>
  );
}
