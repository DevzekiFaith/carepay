import { NextResponse } from "next/server";
import { sendOrderReceiptEmail, sendServiceBookingEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "order_receipt") {
      const res = await sendOrderReceiptEmail(data);
      return NextResponse.json(res);
    }

    if (type === "service_booking") {
      const res = await sendServiceBookingEmail(data);
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: "Invalid email type" }, { status: 400 });
  } catch (err: any) {
    console.error("[Email API] Handler error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
