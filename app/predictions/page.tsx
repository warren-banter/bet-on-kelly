import type { Metadata } from 'next';
import GameCard from '@/components/GameCard';
import { matchesByDate, matches } from '@/content/matches';
import { SITE_NAME } from '@/content/config';

export const metadata: Metadata = {
  title: 'Predictions',
  description: `Predicted scorelines and win probabilities for all ${matches.length} World Cup 2026 group-stage games.`,
  alternates: { canonical: '/predictions/' },
};

export default function PredictionsPage() {
  const days = matchesByDate();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} — World Cup 2026 Predictions`,
    description: `Predicted scorelines and win probabilities for all ${matches.length} group-stage games.`,
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
            World Cup 2026
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Predictions for <span className="text-accent">every game.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            A clear tip and a predicted scoreline for all {matches.length}{' '}
            group-stage matches. Open any game for the detail, then predict it
            yourself.
          </p>
        </div>
      </section>

      {/* Match list */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {days.map((day) => (
          <section key={day.date} className="mb-9 last:mb-0">
            <h2 className="sticky top-[57px] z-10 -mx-4 mb-3 border-b border-line bg-page/95 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink-soft backdrop-blur sm:mx-0 sm:border-none sm:bg-transparent sm:px-0">
              {day.label}
            </h2>
            <div className="space-y-3">
              {day.matches.map((match) => (
                <GameCard key={match.slug} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
