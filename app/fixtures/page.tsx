import type { Metadata } from 'next';
import FixturesList from '@/components/FixturesList';
import { fixturesByDate, matches } from '@/content/matches';

export const metadata: Metadata = {
  title: 'Fixtures',
  description: `Full World Cup 2026 group-stage schedule — kickoff times and venues for all ${matches.length} games, with a link to each prediction.`,
  alternates: { canonical: '/fixtures/' },
};

export default function FixturesPage() {
  const days = fixturesByDate();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Fixtures &amp; <span className="text-accent">kick-offs</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            What is still to play and when. Times are local to each venue. Open
            any game for our prediction, or predict it yourself.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FixturesList days={days} />
      </div>
    </>
  );
}
