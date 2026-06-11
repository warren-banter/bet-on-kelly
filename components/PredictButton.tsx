import { AFFILIATE_URL } from '@/content/config';

interface PredictButtonProps {
  label?: string;
  className?: string;
  // Visual size: compact for rows, large for detail/team pages.
  size?: 'sm' | 'lg';
}

// The "Predict here" call to action. Reads the affiliate URL from one place
// (content/config.ts) so the real link is a single-file swap.
export default function PredictButton({
  label = 'Predict here',
  className = '',
  size = 'sm',
}: PredictButtonProps) {
  const sizing =
    size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2.5 text-sm';

  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-accent font-bold text-black shadow-[0_0_16px_rgba(43,255,136,0.35)] transition-colors hover:bg-accent-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${sizing} ${className}`}
    >
      {label}
    </a>
  );
}
