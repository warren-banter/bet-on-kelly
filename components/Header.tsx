import Link from 'next/link';
import { SITE_NAME } from '@/content/config';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-6 w-6 rounded-md bg-accent shadow-[0_0_12px_rgba(43,255,136,0.5)]"
          />
          <span className="text-lg font-extrabold tracking-tight text-ink">
            {SITE_NAME}
          </span>
        </Link>
        <nav className="-mx-1 flex items-center gap-0.5 overflow-x-auto text-sm font-semibold sm:gap-1">
          {[
            ['/fixtures/', 'Fixtures'],
            ['/predictions/', 'Predictions'],
            ['/groups/', 'Groups'],
            ['/knockout/', 'Knockout'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
