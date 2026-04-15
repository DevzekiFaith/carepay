import { NextRequest, NextResponse } from 'next/server';

export interface VerifyNinResult {
  status: 'verified' | 'rejected' | 'error';
  details?: {
    fullName: string;
    dob: string;
    gender: string;
    photo?: string;
  };
  reason?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerifyNinResult>> {
  try {
    const { nin } = await request.json() as { nin?: string };

    if (!nin || nin.length !== 11 || !/^\d+$/.test(nin)) {
      return NextResponse.json({
        status: 'error',
        reason: 'Invalid NIN format. Must be 11 digits.',
      }, { status: 400 });
    }

    // SIMULATION LOGIC:
    // In a real environment, this would call a service like SmileID, Dojah, or Identitypass.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demonstration, let's treat NINs starting with '0' as invalid
    if (nin.startsWith('0')) {
      return NextResponse.json({
        status: 'rejected',
        reason: 'NIN record not found or inactive. Please contact NIMC.',
      });
    }

    // Treat NINs ending in '9' as a mismatch for testing
    if (nin.endsWith('9')) {
      return NextResponse.json({
        status: 'rejected',
        reason: 'NIN exists but verification failed due to data inconsistency.',
      });
    }

    // Success simulation
    const mockNames = [
      "Adebayor Johnson",
      "Chukwuemeka Obi",
      "Fatima Abubakar",
      "Olawale Ibrahim",
      "Nneka Onyeze",
      "Musa Danjuma"
    ];
    
    // Seeded random name based on NIN digits for consistency
    const nameIndex = parseInt(nin.slice(-1)) % mockNames.length;
    const verifiedName = mockNames[nameIndex];

    return NextResponse.json({
      status: 'verified',
      details: {
        fullName: verifiedName,
        dob: "15-04-1992",
        gender: nin.slice(-2, -1) === '1' ? "Female" : "Male",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + verifiedName
      },
      reason: 'Identity confirmed via National Identity Database.'
    });

  } catch (err) {
    console.error('[verify-nin]', err);
    return NextResponse.json({
      status: 'error',
      reason: 'Internal identity service error. Please try again later.',
    }, { status: 500 });
  }
}
