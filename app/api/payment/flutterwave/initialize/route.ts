import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      orderRef, 
      amount, 
      email, 
      name, 
      phone, 
      title = "HomeCare Technologies", 
      description = "Smart Home & Artisan Service Payment",
      type = "store_order",
      userId
    } = body;

    if (!amount || !email || !orderRef) {
      return NextResponse.json(
        { error: "Missing required payment fields (amount, email, orderRef)" },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Flutterwave secret key is not configured on server" },
        { status: 500 }
      );
    }

    // Determine base host origin
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;

    const redirectUrl = `${origin}/api/payment/flutterwave/verify?ref=${encodeURIComponent(orderRef)}&type=${encodeURIComponent(type)}`;

    const flwPayload = {
      tx_ref: `${orderRef}-${Date.now()}`,
      amount: Number(amount),
      currency: "NGN",
      redirect_url: redirectUrl,
      payment_options: "card,ussd,banktransfer,mobilemoneyghana,barter",
      customer: {
        email: email.trim(),
        phonenumber: phone || "08000000000",
        name: name || "HomeCare Customer",
      },
      customizations: {
        title: title,
        description: description,
        logo: `${origin}/hclogo.png`,
      },
      meta: {
        order_ref: orderRef,
        type: type,
        user_id: userId || null,
      }
    };

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flwPayload),
    });

    const data = await response.json();

    if (data.status !== "success" || !data.data?.link) {
      console.error("Flutterwave initialization failed:", data);
      return NextResponse.json(
        { error: data.message || "Failed to initialize Flutterwave payment link", details: data },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.data.link,
      txRef: flwPayload.tx_ref
    });
  } catch (err: unknown) {
    console.error("Flutterwave API init error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error initializing payment" },
      { status: 500 }
    );
  }
}
