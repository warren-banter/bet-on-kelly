import { countryToISO } from '@/content/matches';

interface FlagProps {
  country: string;
  className?: string;
}

// Renders an SVG flag from the `flag-icons` sprite set. Not an emoji.
// Falls back to a neutral placeholder square if a country isn't mapped.
export default function Flag({ country, className = '' }: FlagProps) {
  const code = countryToISO[country];

  if (!code) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-6 rounded-[3px] bg-line ${className}`}
      />
    );
  }

  return (
    <span
      className={`fi fi-${code} h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-white/10 ${className}`}
      role="img"
      aria-label={`${country} flag`}
    />
  );
}
