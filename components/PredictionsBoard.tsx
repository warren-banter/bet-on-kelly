'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type MatchDay } from '@/content/matches';
import GameCard from './GameCard';

// --- Local-date helpers (all relative to the visitor's own timezone) -------

// ISO yyyy-mm-dd for a Date, read from its LOCAL components.
function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Monday-based start of the week containing the given ISO date.
function weekStartISO(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const mondayOffset = (d.getDay() + 6) % 7; // 0 = Monday … 6 = Sunday
  d.setDate(d.getDate() - mondayOffset);
  return localISO(d);
}

function addDaysISO(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return localISO(d);
}

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

// --- Small presentational pieces -------------------------------------------

function DaySection({ day }: { day: MatchDay }) {
  return (
    <div className="mb-7 last:mb-0">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">
        {day.label}
      </h4>
      <div className="space-y-3">
        {day.matches.map((match) => (
          <GameCard key={match.slug} match={match} />
        ))}
      </div>
    </div>
  );
}

function Group({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function BoardHeader() {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          World Cup 2026
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Kelly&rsquo;s predictions
        </h2>
      </div>
      <Link
        href="/methodology/"
        className="shrink-0 text-sm font-semibold text-accent hover:underline"
      >
        How we predict &rarr;
      </Link>
    </div>
  );
}

// --- Board ------------------------------------------------------------------

export default function PredictionsBoard({ days }: { days: MatchDay[] }) {
  // `today` is null until mount, so the server-rendered HTML (and the no-JS
  // fallback) lists every match chronologically — crawlers see all of them.
  const [today, setToday] = useState<string | null>(null);
  const [weeksRevealed, setWeeksRevealed] = useState(0);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    setToday(localISO(new Date()));
  }, []);

  if (!today) {
    return (
      <section
        id="predictions"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
      >
        <BoardHeader />
        <Group eyebrow="Group stage" title="All predictions">
          {days.map((day) => (
            <DaySection key={day.date} day={day} />
          ))}
        </Group>
      </section>
    );
  }

  // Partition the calendar relative to the visitor's "today".
  const todayDay = days.find((d) => d.date === today) ?? null;
  const previousDays = days.filter((d) => d.date < today);
  const futureDays = days.filter((d) => d.date > today);

  const thisWeekEnd = addDaysISO(weekStartISO(today), 7); // exclusive

  // The lead block: today's games, or — if none today — the next match day.
  let lead: { tag: string; title: string; day: MatchDay } | null = null;
  if (todayDay) {
    lead = { tag: 'Today', title: todayDay.label, day: todayDay };
  } else if (futureDays.length > 0) {
    lead = { tag: 'Next up', title: futureDays[0].label, day: futureDays[0] };
  }
  const leadDate = lead?.day.date ?? null;

  const thisWeekDays = futureDays.filter(
    (d) => d.date < thisWeekEnd && d.date !== leadDate,
  );
  const laterDays = futureDays.filter(
    (d) => d.date >= thisWeekEnd && d.date !== leadDate,
  );

  // Bucket the remaining days into Monday-based weeks (input is already sorted).
  const weekBuckets: MatchDay[][] = [];
  let currentStart: string | null = null;
  for (const d of laterDays) {
    const ws = weekStartISO(d.date);
    if (ws !== currentStart) {
      currentStart = ws;
      weekBuckets.push([]);
    }
    weekBuckets[weekBuckets.length - 1].push(d);
  }

  const visibleWeeks = weekBuckets.slice(0, weeksRevealed);
  const hasMoreWeeks = weeksRevealed < weekBuckets.length;
  const nextBucket = weekBuckets[weeksRevealed];
  const nextLabel =
    weeksRevealed === 0
      ? "See next week's predictions"
      : nextBucket
        ? `See ${shortDate(nextBucket[0].date)} – ${shortDate(nextBucket[nextBucket.length - 1].date)}`
        : 'See more';

  const previousCount = previousDays.reduce(
    (n, d) => n + d.matches.length,
    0,
  );

  return (
    <section
      id="predictions"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
    >
      <BoardHeader />

      {/* Today (or next up) */}
      {lead && (
        <Group eyebrow={lead.tag} title={lead.title}>
          <div className="space-y-3">
            {lead.day.matches.map((match) => (
              <GameCard key={match.slug} match={match} />
            ))}
          </div>
        </Group>
      )}

      {/* Previous predictions — collapsed by default */}
      {previousDays.length > 0 && (
        <div className="mb-10">
          <button
            type="button"
            onClick={() => setShowPrevious((v) => !v)}
            aria-expanded={showPrevious}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {showPrevious
              ? 'Hide previous predictions'
              : `Show previous predictions (${previousCount} games)`}
            <svg
              className={`h-4 w-4 transition-transform ${showPrevious ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {showPrevious && (
            <div className="mt-6">
              {previousDays.map((day) => (
                <DaySection key={day.date} day={day} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rest of this week */}
      {thisWeekDays.length > 0 && (
        <Group eyebrow="This week" title="Rest of this week">
          {thisWeekDays.map((day) => (
            <DaySection key={day.date} day={day} />
          ))}
        </Group>
      )}

      {/* Upcoming weeks, revealed on demand */}
      {visibleWeeks.map((bucket, i) => (
        <Group
          key={bucket[0].date}
          eyebrow={i === 0 ? 'Next week' : 'Upcoming'}
          title={`${shortDate(bucket[0].date)} – ${shortDate(bucket[bucket.length - 1].date)}`}
        >
          {bucket.map((day) => (
            <DaySection key={day.date} day={day} />
          ))}
        </Group>
      ))}

      {hasMoreWeeks && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setWeeksRevealed((n) => n + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-black shadow-[0_0_16px_rgba(43,255,136,0.35)] transition-colors hover:bg-accent-bright"
          >
            {nextLabel}
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </section>
  );
}
