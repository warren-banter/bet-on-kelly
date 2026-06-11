import { SITE_NAME } from '@/content/config';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-ink">{SITE_NAME}</p>
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
