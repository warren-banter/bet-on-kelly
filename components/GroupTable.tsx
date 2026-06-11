import Link from 'next/link';
import { type Group, teamSlug } from '@/content/matches';
import Flag from './Flag';

function gd(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export default function GroupTable({ group }: { group: Group }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-base font-bold text-ink">{group.name}</h2>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Predicted table
        </span>
      </div>

      {/* Standings */}
      <div className="px-1.5 py-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-soft">
              <th className="py-2 pl-2 text-left font-medium">#</th>
              <th className="py-2 text-left font-medium">Team</th>
              <th className="px-1.5 py-2 text-center font-medium">P</th>
              <th className="px-1.5 py-2 text-center font-medium">W</th>
              <th className="px-1.5 py-2 text-center font-medium">D</th>
              <th className="px-1.5 py-2 text-center font-medium">L</th>
              <th className="px-1.5 py-2 text-center font-medium">GD</th>
              <th className="px-2 py-2 text-center font-bold text-ink">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((s, i) => {
              const qualifies = i < 2; // top two advance
              return (
                <tr key={s.team} className="border-t border-line/60">
                  <td
                    className={`py-2.5 pl-2 font-bold tabular-nums ${
                      qualifies ? 'text-accent' : 'text-ink-soft'
                    }`}
                  >
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-2">
                    <Link
                      href={`/team/${teamSlug(s.team)}/`}
                      className="flex min-w-0 items-center gap-2 hover:text-accent"
                    >
                      <Flag country={s.team} />
                      <span className="truncate font-semibold text-ink hover:text-accent">
                        {s.team}
                      </span>
                    </Link>
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-ink-soft">
                    {s.played}
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-ink-soft">
                    {s.won}
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-ink-soft">
                    {s.drawn}
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-ink-soft">
                    {s.lost}
                  </td>
                  <td className="px-1.5 text-center tabular-nums text-ink-soft">
                    {gd(s.gd)}
                  </td>
                  <td className="px-2 text-center font-bold tabular-nums text-ink">
                    {s.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Predicted results */}
      <div className="border-t border-line px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Predicted results
        </p>
        <ul className="space-y-1.5">
          {group.matches.map((m) => (
            <li
              key={m.slug}
              className="flex items-center gap-2 text-[13px] text-ink-soft"
            >
              <span className="flex-1 truncate text-right">{m.home}</span>
              <span className="rounded bg-raised px-2 py-0.5 font-bold tabular-nums text-ink">
                {m.homeScore}-{m.awayScore}
              </span>
              <span className="flex-1 truncate">{m.away}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
