import type { MetadataRoute } from 'next';
import { matches, allTeams, teamSlug } from '@/content/matches';
import { SITE_URL } from '@/content/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const games = matches.map((m) => ({
    url: `${SITE_URL}/game/${m.slug}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const teams = allTeams().map((t) => ({
    url: `${SITE_URL}/team/${teamSlug(t)}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const staticPages = [
    { path: '/', priority: 1, freq: 'daily' as const },
    { path: '/fixtures/', priority: 0.9, freq: 'daily' as const },
    { path: '/predictions/', priority: 0.9, freq: 'daily' as const },
    { path: '/groups/', priority: 0.8, freq: 'weekly' as const },
    { path: '/knockout/', priority: 0.7, freq: 'weekly' as const },
    { path: '/methodology/', priority: 0.6, freq: 'monthly' as const },
  ].map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  return [...staticPages, ...teams, ...games];
}
