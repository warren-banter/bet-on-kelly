import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/content/config';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generated to a static PNG at build time (works with output: 'export').
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#070809',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#2bff88',
          }}
        >
          World Cup 2026
        </div>
        <div style={{ marginTop: 24, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 24, fontSize: 36, color: 'rgba(255,255,255,0.72)' }}>
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
