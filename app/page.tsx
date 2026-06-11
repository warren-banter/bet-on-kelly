import type { Metadata } from 'next';
import Link from 'next/link';
import HomeHero from '@/components/hero/HomeHero';
import GameCard from '@/components/GameCard';
import { matchesByDate } from '@/content/matches';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/content/config';

export const metadata: Metadata = {
  title: `${SITE_NAME} — World Cup 2026 Predictions`,
  description: SITE_TAGLINE,
  alternates: { canonical: '/' },
};

const sections = [
  {
    href: '/fixtures/',
    title: 'Fixtures',
    desc: 'Every game, when it kicks off and where it is played.',
  },
  {
    href: '/predictions/',
    title: 'Predictions',
    desc: 'Predicted scorelines and win probabilities for all 72 games.',
  },
  {
    href: '/groups/',
    title: 'Group Stage',
    desc: 'Predicted tables, then drill into any team.',
  },
  {
    href: '/knockout/',
    title: 'Knockout',
    desc: 'The bracket — who goes through and who lifts the cup.',
  },
];

export default function HomePage() {
  const openingDay = matchesByDate()[0];

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

      {/* Section entry cards */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
            >
              <span className="text-lg font-bold text-ink transition-colors group-hover:text-accent">
                {s.title}
              </span>
              <span className="mt-2 flex-1 text-sm text-ink-soft">{s.desc}</span>
              <span className="mt-4 text-sm font-semibold text-accent">
                Open &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Opening day */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Opening day
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
              {openingDay.label}
            </h2>
          </div>
          <Link
            href="/predictions/"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            All predictions &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {openingDay.matches.map((match) => (
            <GameCard key={match.slug} match={match} />
          ))}
        </div>
      </div>
    </>
  );
}
