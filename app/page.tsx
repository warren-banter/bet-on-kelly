import type { Metadata } from 'next';
import HomeHero from '@/components/hero/HomeHero';
import PredictionsBoard from '@/components/PredictionsBoard';
import PreviousPredictions from '@/components/PreviousPredictions';
import Multis from '@/components/Multis';
import { betDaysByDate, remainingFixtures } from '@/content/bets';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/content/config';

export const metadata: Metadata = {
  title: `${SITE_NAME} — World Cup 2026 Predictions`,
  description: `Kelly's World Cup 2026 betting picks — match results, goals and both-teams-to-score across ${remainingFixtures} remaining fixtures. Today's picks first.`,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const days = betDaysByDate();

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

      <HomeHero />
      <PredictionsBoard days={days} />
      <PreviousPredictions />
      <Multis />
    </>
  );
}
