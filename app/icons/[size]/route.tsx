import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    { size: '192' },
    { size: '512' },
  ];
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ size: string }> }
) {
  const params = await props.params;
  const size = parseInt(params.size, 10) || 192;
  const fontSize = Math.round(size * 0.48);
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: '#f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius,
        }}
      >
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: fontSize,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          H
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
