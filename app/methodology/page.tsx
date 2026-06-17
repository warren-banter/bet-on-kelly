import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/content/config';

export const metadata: Metadata = {
  title: 'How we predict',
  description:
    'How Bet On Kelly predicts the 2026 World Cup: a Poisson ratings model trained on ~50,000 international results, blended with live prediction-market odds and run through tens of thousands of tournament simulations.',
  alternates: { canonical: '/methodology/' },
};

const steps = [
  {
    n: 1,
    title: 'We rate every team',
    body: 'Each of the 48 nations gets an attack and defense rating, learned from roughly 50,000 international matches dating back decades. Recent games count for much more, and competitive matches count more than friendlies.',
  },
  {
    n: 2,
    title: 'We turn ratings into a score',
    body: "For any matchup we combine one team's attack against the other's defense to estimate how many goals each is likely to score. Because football is partly luck, we calculate the probability of every possible scoreline, not just one.",
  },
  {
    n: 3,
    title: 'We blend in the market',
    body: "We fold in live odds from the prediction market Polymarket. The market already reflects things our model can't see — injuries, suspensions, current form — so this corrects our blind spots and keeps the numbers honest.",
  },
  {
    n: 4,
    title: 'We simulate the tournament',
    body: 'We play out the entire World Cup — group stage, the 8 best third-placed teams, and the full knockout bracket — tens of thousands of times. How often each team advances or wins gives us the percentages you see.',
  },
];

const faqs = [
  {
    q: 'Do you use expected goals (xG)?',
    a: "For club football, yes — but xG isn't available for international matches, so the World Cup model is built on actual goals plus the market blend instead.",
  },
  {
    q: 'Do you account for injuries and lineups?',
    a: 'Not directly — but the market does, and we blend it in, so injury and team-news effects are captured indirectly.',
  },
  {
    q: 'Why does your pick sometimes differ from the bookmakers?',
    a: 'Our model has its own view of team strength from the results data. Where it disagrees with the market, the published number is a blend of the two — so you will occasionally see us higher or lower on a team than the odds alone.',
  },
  {
    q: 'Will the predictions update during the tournament?',
    a: 'Yes — as real results come in, teams that are eliminated or have clinched drop to 0% or rise to 100%, and the remaining probabilities sharpen.',
  },
];

const glossary = [
  ['Attack / defense rating', "A team's learned tendency to score and to concede."],
  [
    'Expected goals (here)',
    'The average number of goals a matchup is projected to produce for each side.',
  ],
  [
    'De-vig / margin removal',
    "Stripping the bookmaker's built-in profit margin so odds reflect the true implied probability.",
  ],
  [
    'Monte Carlo simulation',
    'Playing the tournament out at random tens of thousands of times to estimate how often each outcome happens.',
  ],
  [
    'Best third-placed teams',
    'Under the 2026 format, the 8 highest-ranked third-place finishers across the 12 groups also advance.',
  ],
];

const toc = [
  ['how-it-works', 'How it works'],
  ['the-data', 'The data'],
  ['the-model', 'The rating model'],
  ['the-market', 'Blending with the market'],
  ['simulation', 'Simulating the tournament'],
  ['percentages', 'What the percentages mean'],
  ['faq', 'FAQ'],
  ['limitations', 'Limitations'],
  ['credits', 'Data credits'],
  ['glossary', 'Glossary'],
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-2xl font-extrabold tracking-tight text-ink"
    >
      {children}
    </h2>
  );
}

export default function MethodologyPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'How we predict',
        item: `${SITE_URL}/methodology/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-line bg-page">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-soft">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">How we predict</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Methodology
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            How we predict the <span className="text-accent">World Cup</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            We rate each national team&apos;s true strength from decades of
            international results, blend that with live prediction-market odds,
            then simulate the whole tournament tens of thousands of times.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Table of contents */}
        <nav
          aria-label="On this page"
          className="mb-10 rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            On this page
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {/* How it works */}
          <section className="space-y-5">
            <H2 id="how-it-works">How it works</H2>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* The data */}
          <section className="space-y-4">
            <H2 id="the-data">The data</H2>
            <ul className="space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    ~50,000 international match results
                  </span>{' '}
                  (men&apos;s national teams, 1872&ndash;present), updated
                  continuously, including the official 2026 World Cup fixture
                  list and whether each game is at a neutral venue.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    Live World Cup odds
                  </span>{' '}
                  from Polymarket: per-match win/draw/loss markets,
                  group-winner markets, and outright title odds.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Everything is free and public &mdash; no private data.</span>
              </li>
            </ul>
          </section>

          {/* The model */}
          <section className="space-y-4">
            <H2 id="the-model">The rating model</H2>
            <p className="text-ink-soft">
              At the core is a{' '}
              <span className="font-semibold text-ink">Poisson goals model</span>{' '}
              (a well-established approach in football analytics, often called a
              Dixon&ndash;Coles model). It gives each team an{' '}
              <span className="font-semibold text-ink">attack rating</span> (how
              many goals they tend to create) and a{' '}
              <span className="font-semibold text-ink">defense rating</span> (how
              many they tend to concede), estimated by maximum likelihood across
              all the matches. Three refinements make it fit international
              football:
            </p>
            <ul className="space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    Recency weighting
                  </span>{' '}
                  &mdash; a recent match matters far more than an old one (about a
                  3-year half-life), so ratings track current squads.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    Match importance
                  </span>{' '}
                  &mdash; friendlies are noisy (rotated squads, low stakes), so
                  they count less than qualifiers and major-tournament games.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    Home advantage only when it applies
                  </span>{' '}
                  &mdash; almost every World Cup game is at a neutral venue, so no
                  team gets a home boost except the hosts (USA, Canada, Mexico)
                  when they play at home.
                </span>
              </li>
            </ul>
            <p className="text-ink-soft">
              For any matchup the model outputs expected goals for each side, and
              from those a full grid of scoreline probabilities &mdash; which
              gives the win/draw/loss chances and the single most likely score.
            </p>
          </section>

          {/* The market */}
          <section className="space-y-4">
            <H2 id="the-market">Blending with the market</H2>
            <p className="text-ink-soft">
              A pure ratings model has one well-known weakness: it can over-rate
              teams that pile up goals against weak regional opponents, and it
              can&apos;t see late news like injuries. So we blend our model with
              the live market:
            </p>
            <ul className="space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">For each match</span>,
                  our scoreline probabilities are mixed with Polymarket&apos;s
                  de-vigged (margin-removed) odds, leaning toward the market.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">
                    For the knockout rounds
                  </span>{' '}
                  (where the matchups aren&apos;t known in advance, so no market
                  exists yet), we anchor each team&apos;s strength to the
                  market&apos;s outright title odds, so the blend stays realistic
                  deep into the bracket.
                </span>
              </li>
            </ul>
            <p className="text-ink-soft">
              The result keeps our model&apos;s detailed scoreline picture while
              inheriting the market&apos;s accuracy on everything our model
              can&apos;t observe.
            </p>
          </section>

          {/* Simulation */}
          <section className="space-y-4">
            <H2 id="simulation">Simulating the tournament</H2>
            <p className="text-ink-soft">
              To answer &ldquo;who advances?&rdquo; and &ldquo;who wins?&rdquo;,
              we run a{' '}
              <span className="font-semibold text-ink">
                Monte Carlo simulation
              </span>
              :
            </p>
            <ol className="space-y-2 text-ink-soft">
              {[
                'Play all 72 group games using the blended match probabilities.',
                'Rank each group; the top 2 advance, plus the 8 best third-placed teams by points (the 2026 format).',
                'Play the knockout bracket through to the final.',
                'Repeat tens of thousands of times and count outcomes.',
              ].map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold text-accent">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <p className="text-ink-soft">
              A team&apos;s title chance is simply the share of simulations it
              won. We report the same way for reaching the final, the semis, and
              getting out of the group.
            </p>
          </section>

          {/* Percentages */}
          <section className="space-y-4">
            <H2 id="percentages">What the percentages mean</H2>
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
              <ul className="space-y-3 text-ink">
                <li>
                  These are{' '}
                  <span className="font-semibold text-accent">
                    probabilities, not certainties.
                  </span>{' '}
                  &ldquo;Spain 15% to win&rdquo; means Spain lifted the trophy in
                  about 1 in 7 simulations &mdash; the most likely winner, but far
                  from a lock.
                </li>
                <li>
                  No favourite is ever very likely to win a 48-team tournament
                  &mdash; even the top team usually sits around 15%. A wide-open
                  field is normal, not a flaw.
                </li>
                <li>
                  A team shown at 65% to advance will still fail to advance about
                  a third of the time. Upsets are built into the math.
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <H2 id="faq">FAQ</H2>
            <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {faqs.map((f) => (
                <div key={f.q} className="p-5">
                  <h3 className="font-bold text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Limitations */}
          <section className="space-y-4">
            <H2 id="limitations">Limitations &amp; disclaimer</H2>
            <ul className="space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  These are statistical forecasts for information and
                  entertainment, not guarantees. Anything can happen in a single
                  match.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  The knockout bracket draw is approximated in the simulation
                  rather than using the exact official slotting of
                  best-third-placed teams; this mainly affects projected paths,
                  not title odds.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  Third-place qualification uses points, then goal difference,
                  then goals scored &mdash; which closely follows, but is not
                  identical to, FIFA&apos;s full tiebreak order.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  {SITE_NAME} is not affiliated with FIFA. Predictions are
                  estimates; take part responsibly and only if you are of legal
                  age in your jurisdiction.
                </span>
              </li>
            </ul>
          </section>

          {/* Credits */}
          <section className="space-y-4">
            <H2 id="credits">Data credits</H2>
            <ul className="space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  International results &amp; fixtures: the{' '}
                  <a
                    href="https://github.com/martj42/international_results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    martj42/international_results
                  </a>{' '}
                  open dataset on GitHub.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  Match and title odds:{' '}
                  <a
                    href="https://polymarket.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    Polymarket
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          {/* Glossary */}
          <section className="space-y-4">
            <H2 id="glossary">Glossary</H2>
            <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {glossary.map(([term, def]) => (
                <div key={term} className="p-5">
                  <dt className="font-bold text-ink">{term}</dt>
                  <dd className="mt-1 text-sm text-ink-soft">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-line bg-surface p-6 text-center">
            <p className="text-lg font-bold text-ink">
              See the numbers in action
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Every game has a predicted scoreline and a win probability.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/#predictions"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-accent-bright"
              >
                See predictions
              </Link>
              <Link
                href="/groups/"
                className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Group tables
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
