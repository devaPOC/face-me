import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FaceMe — Peer-to-Peer Video Calling';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Minimal Black & White Vector Logo Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '30px',
            backgroundColor: '#111111',
            border: '1px solid #333333',
            marginBottom: '40px',
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 21C16 18.7909 17.7909 17 20 17H34C36.2091 17 38 18.7909 38 21V43C38 45.2091 36.2091 47 34 47H20C17.7909 47 16 45.2091 16 43V21Z"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M38 27.5L48 21V43L38 36.5"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="27" cy="32" r="4" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Minimalist Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            marginBottom: '16px',
            color: '#FFFFFF',
          }}
        >
          FaceMe
        </div>

        {/* Minimal Subtitle */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: '500',
            color: '#888888',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Instant · Zero-Persistence · P2P Video Calls
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
