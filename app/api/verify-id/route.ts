import { NextRequest, NextResponse } from 'next/server';

export interface VerifyIdResult {
  status: 'verified' | 'rejected' | 'pending_manual' | 'error';
  confidence: 'high' | 'medium' | 'low' | null;
  reason: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerifyIdResult>> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful degradation: no API key → return pending_manual
  if (!apiKey) {
    return NextResponse.json({
      status: 'pending_manual',
      confidence: null,
      reason: 'AI verification pending — our team will manually review your photo within 24 hours.',
    });
  }

  try {
    const body = await request.json() as { imageBase64?: string; workerName?: string };
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({
        status: 'error',
        confidence: null,
        reason: 'No image provided.',
      }, { status: 400 });
    }

    // Strip potential data URL prefix
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an identity verification assistant. Evaluate this image:
1. Is there a clear, real human face visible? (YES/NO)
2. Is the photo high enough quality for identity verification? (YES/NO)
3. Does it appear to be a genuine photo (not a photo of a photo or screen)? (YES/NO)

Respond ONLY in this JSON format:
{"faceVisible": true/false, "qualityOk": true/false, "genuine": true/false, "confidence": "high"/"medium"/"low", "reason": "brief explanation"}`,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Parse JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse Gemini response');

    const parsed = JSON.parse(jsonMatch[0]) as {
      faceVisible: boolean;
      qualityOk: boolean;
      genuine: boolean;
      confidence: 'high' | 'medium' | 'low';
      reason: string;
    };

    const verified = parsed.faceVisible && parsed.qualityOk && parsed.genuine;

    return NextResponse.json({
      status: verified ? 'verified' : 'rejected',
      confidence: parsed.confidence,
      reason: parsed.reason,
    });
  } catch (err) {
    console.error('[verify-id]', err);
    // Fail safe: return pending_manual rather than blocking registration
    return NextResponse.json({
      status: 'pending_manual',
      confidence: null,
      reason: 'Automated verification temporarily unavailable. Our team will review manually.',
    });
  }
}
