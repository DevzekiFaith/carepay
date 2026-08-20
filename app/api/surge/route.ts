import { NextRequest, NextResponse } from 'next/server';
import { 
  getSurgeResult, 
  getSurgePrice, 
  getGlobalOverrides, 
  setGlobalOverrides, 
  clearGlobalOverrides,
  BASE_PRICES 
} from '@/lib/surge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get('all') === 'true';

  if (getAll) {
    const overrides = getGlobalOverrides();
    const services = Object.keys(BASE_PRICES).map((service) => {
      const surge = getSurgeResult(service, 'Enugu');
      return {
        service,
        basePrice: BASE_PRICES[service],
        ...surge,
        effectiveMultiplier: overrides[service] ?? surge.multiplier,
        surgePrice: getSurgePrice(service, overrides[service] ?? surge.multiplier),
        hasOverride: !!overrides[service],
      };
    });

    return NextResponse.json({
      overrides,
      services,
      activeOverrideCount: Object.keys(overrides).length,
      timestamp: new Date().toISOString(),
    });
  }

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === 'clear') {
      clearGlobalOverrides();
      return NextResponse.json({ 
        success: true, 
        message: 'All overrides cleared', 
        overrides: {} 
      });
    }

    if (body.overrides && typeof body.overrides === 'object') {
      setGlobalOverrides(body.overrides);
      return NextResponse.json({ 
        success: true, 
        message: 'Overrides updated in real-time', 
        overrides: getGlobalOverrides() 
      });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

