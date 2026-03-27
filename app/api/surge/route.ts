import { NextRequest, NextResponse } from 'next/server';
import { getSurgeResult, getSurgePrice } from '@/lib/surge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') ?? 'General Handyman';
  const city = searchParams.get('city') ?? 'Enugu';
  const hourParam = searchParams.get('hour');
  const hour = hourParam ? parseInt(hourParam, 10) : new Date().getHours();

  const surge = getSurgeResult(service, city, hour);
  const displayPrice = getSurgePrice(service, surge.multiplier);

  return NextResponse.json({
    service,
    city,
    ...surge,
    displayPrice,
    timestamp: new Date().toISOString(),
  });
}
