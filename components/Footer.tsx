import Link from 'next/link';
import { SITE_NAME } from '@/content/config';

const footerLinks = [
  ['/fixtures/', 'Fixtures'],
  ['/#predictions', 'Predictions'],
  ['/groups/', 'Groups'],
  ['/knockout/', 'Knockout'],
  ['/methodology/', 'How we predict'],
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-ink">{SITE_NAME}</p>
        <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-ink-soft transition-colors hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Predictions are statistical estimates, not guarantees, and may differ
          from real results. Anything you stake is your own decision and at your
          own risk. Play responsibly, set your own limits, and only take part if
          you are of legal age in your jurisdiction.
        </p>
        <p className="mt-4 text-xs text-ink-soft">
          &copy; {SITE_NAME}. For information only.
        </p>
      </div>
    </footer>
  );
}
