import type { Metadata } from 'next';
import Link from 'next/link';
import HomeHero from '@/components/hero/HomeHero';
import PredictionsBoard from '@/components/PredictionsBoard';
import PreviousPredictions from '@/components/PreviousPredictions';
import { eplDaysByDate, eplBetsBySlug, eplFixtureCount } from '@/content/epl';
import { eplSettledBets, eplResultsSummary } from '@/content/epl_results';
import { resultsSummary, formatHitRate } from '@/content/results';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/content/config';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Premier League Predictions`,
  description: `Premier League betting picks — match results, goals and both-teams-to-score across ${eplFixtureCount} upcoming fixtures. Today's picks first.`,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const days = eplDaysByDate();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHero
        eyebrow="Premier League"
        blurb="Data-led picks for every Premier League fixture — match result, goals and both teams to score. Built on expected goals, blended with the live market."
        showChampions={false}
      />

      <PredictionsBoard
        days={days}
        config={{
          eyebrow: 'Premier League',
          competition: 'Premier League',
          showFlags: false,
          betsBySlug: eplBetsBySlug,
        }}
      />

      <PreviousPredictions
        bets={eplSettledBets}
        summary={eplResultsSummary}
        heading="How our Premier League predictions did"
        emptyNote="We grade every pick against the real result. Premier League outcomes show up here as fixtures finish — the first are settled after the opening weekend."
      />

      {/* World Cup archive pointer */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              World Cup 2026
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
              The tournament is done —{' '}
              {resultsSummary.won} of {resultsSummary.settled} picks landed
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Every World Cup pick we made, graded against the final scores, at a{' '}
              {formatHitRate(resultsSummary.hitRate)} strike rate. Groups,
              knockouts and match pages are still up.
            </p>
          </div>
          <Link
            href="/world-cup/"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            See the World Cup record
          </Link>
        </div>
      </section>
    </>
  );
}
