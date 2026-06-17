'use client';

import { useEffect, useState } from 'react';
import { type MatchDay } from '@/content/matches';
import FixtureRow from './FixtureRow';

// ISO yyyy-mm-dd from a Date's local components.
function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Schedule list that drops days already played, relative to the visitor's
// date. Renders every day in the static HTML (for crawlers), then trims past
// days after mount.
export default function FixturesList({ days }: { days: MatchDay[] }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(localISO(new Date()));
  }, []);

  const shown = today ? days.filter((d) => d.date >= today) : days;

  if (shown.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        The group stage is complete — no upcoming fixtures.
      </p>
    );
  }

  return (
    <>
      {shown.map((day) => (
        <section key={day.date} className="mb-9 last:mb-0">
          <h2 className="sticky top-[57px] z-10 -mx-4 mb-3 border-b border-line bg-page/95 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink-soft backdrop-blur sm:mx-0 sm:border-none sm:bg-transparent sm:px-0">
            {day.label}
          </h2>
          <div className="space-y-3">
            {day.matches.map((match) => (
              <FixtureRow key={match.slug} match={match} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
