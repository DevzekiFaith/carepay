import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeStr } = await params;
  const size = parseInt(sizeStr, 10) || 192;
  const fontSize = Math.round(size * 0.48);
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius,
        }}
      >
        <div
          style={{
            fontFamily: 'serif',
            fontSize: fontSize,
            fontWeight: 700,
            color: '#fafafa',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          C
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
