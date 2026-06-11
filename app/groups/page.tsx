import type { Metadata } from 'next';
import { groups } from '@/content/matches';
import { SITE_NAME } from '@/content/config';
import GroupTable from '@/components/GroupTable';

export const metadata: Metadata = {
  title: 'Group stage standings',
  description:
    'Predicted World Cup 2026 group tables — points, goal difference and predicted results for all 12 groups.',
  alternates: { canonical: '/groups/' },
};

export default function GroupsPage() {
  const allGroups = groups();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Group <span className="text-accent">stage</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft">
            Predicted standings for all {allGroups.length} groups, built from our
            scoreline predictions. Top two in each group advance. Tables show
            played, won, drawn, lost, goal difference and points.
          </p>
        </div>
      </section>

      {/* Group tables */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          {allGroups.map((group) => (
            <GroupTable key={group.name} group={group} />
          ))}
        </div>
        <p className="mt-8 text-xs text-ink-soft">
          {SITE_NAME} tables are predicted outcomes, not results. Predictions are
          estimates and may differ from the real draw and fixtures.
        </p>
      </div>
    </>
  );
}
