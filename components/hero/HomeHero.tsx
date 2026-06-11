'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { champions } from '@/content/champions';

const SoccerBall = dynamic(() => import('./SoccerBall'), {
  ssr: false,
  loading: () => <BallPlaceholder />,
});

function BallPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-48 w-48 rounded-full bg-white/90 shadow-[0_0_60px_rgba(43,255,136,0.25)] sm:h-56 sm:w-56" />
    </div>
  );
}

export default function HomeHero() {
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(champions.length - 1); // start on most recent

  // While hovering the ball, cycle through past champions.
  useEffect(() => {
    if (!hovered) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % champions.length);
    }, 1100);
    return () => clearInterval(id);
  }, [hovered]);

  const champ = champions[index];

  return (
    <section className="relative overflow-hidden border-b border-line bg-page">
      {/* soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:py-20">
        {/* Copy */}
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl">
            Every game.
            <br />
            <span className="text-accent">Every prediction.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-soft">
            Data-led predictions, predicted scorelines and group tables for all
            72 group-stage matches. Find the call, then predict it yourself.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/predictions/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-black shadow-[0_0_16px_rgba(43,255,136,0.35)] transition-colors hover:bg-accent-bright"
            >
              See predictions
            </Link>
            <Link
              href="/fixtures/"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Fixtures
            </Link>
          </div>
        </div>

        {/* Ball + champions */}
        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="relative h-72 w-full sm:h-96">
            <SoccerBall onHoverChange={setHovered} />

            {/* Champions reveal */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 flex justify-center transition-all duration-300 ${
                hovered
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0'
              }`}
            >
              <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-surface/90 px-4 py-2.5 backdrop-blur">
                <span className="text-2xl font-extrabold tabular-nums text-accent">
                  {champ.year}
                </span>
                <span
                  className={`fi fi-${champ.iso} h-5 w-7 rounded-[3px] ring-1 ring-white/10`}
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-ink">
                  {champ.country}
                </span>
              </div>
            </div>
          </div>

          <p
            className={`mt-3 text-center text-xs font-medium uppercase tracking-wider text-ink-soft transition-opacity ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Hover the ball for past champions
          </p>
        </div>
      </div>
    </section>
  );
}
