import type { Metadata } from 'next';
import Link from 'next/link';
import PreviousPredictions from '@/components/PreviousPredictions';
import Multis from '@/components/Multis';
import { resultsSummary, formatHitRate } from '@/content/results';
import { SITE_NAME } from '@/content/config';

export const metadata: Metadata = {
  title: 'World Cup 2026 predictions — the full record',
  description: `Every World Cup 2026 pick we made, graded against the real final scores: ${resultsSummary.won} of ${resultsSummary.settled} settled picks landed at a ${formatHitRate(resultsSummary.hitRate)} strike rate.`,
  alternates: { canonical: '/world-cup/' },
};

export default function WorldCupPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: '/' },
      { '@type': 'ListItem', position: 2, name: 'World Cup 2026', item: '/world-cup/' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026 &middot; Archive
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {resultsSummary.won} of {resultsSummary.settled}{' '}
            <span className="text-accent">landed</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            The tournament is over. Every pick we published is below, graded
            against the real final score — a{' '}
            {formatHitRate(resultsSummary.hitRate)} strike rate across the
            competition. Nothing has been quietly removed.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/groups/"
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Group tables
            </Link>
            <Link
              href="/knockout/"
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Knockout bracket
            </Link>
            <Link
              href="/fixtures/"
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              All fixtures
            </Link>
          </div>
        </div>
      </section>

      {/* No upcoming board: the tournament is finished, so every pick lives in
          the graded record below. */}
      <PreviousPredictions heading="Every World Cup pick, graded" />
      <Multis />
    </>
  );
}
