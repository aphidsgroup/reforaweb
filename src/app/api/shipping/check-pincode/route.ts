import { NextRequest, NextResponse } from "next/server";
import { isValidPincode } from "@/lib/utils";

// TODO: Integrate Shiprocket API for real pincode serviceability checks.
// Shiprocket endpoint: POST https://apiv2.shiprocket.in/v1/external/courier/serviceability/
// Headers: Authorization: Bearer <SHIPROCKET_TOKEN>
// Body: { pickup_postcode, delivery_postcode, cod, weight }
// Docs: https://apidocs.shiprocket.in/#serviceability

interface PincodeCheckResponse {
  serviceable: boolean;
  codAvailable: boolean;
  estimatedDays: number | null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.pincode !== "string") {
      return NextResponse.json(
        { error: "Pincode is required." },
        { status: 400 }
      );
    }

    const pincode = body.pincode.trim();

    // Validate 6-digit Indian pincode format
    if (!isValidPincode(pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode. Must be a 6-digit number not starting with 0." },
        { status: 400 }
      );
    }

    // ── Live Shiprocket check (when credentials are configured) ──
    const shiprocketToken = process.env.SHIPROCKET_TOKEN;

    if (shiprocketToken) {
      try {
        const sourcePin = process.env.WAREHOUSE_PINCODE ?? "400001";
        const srRes = await fetch(
          "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${shiprocketToken}`,
            },
            body: JSON.stringify({
              pickup_postcode: sourcePin,
              delivery_postcode: pincode,
              cod: 1,
              weight: 0.2, // 100g bar + packaging approximation
            }),
          }
        );

        if (srRes.ok) {
          const srData = await srRes.json();
          const available =
            srData?.status === 200 &&
            Array.isArray(srData?.data?.available_courier_companies) &&
            srData.data.available_courier_companies.length > 0;

          const codAvailable = available
            ? srData.data.available_courier_companies.some(
                (c: { cod: boolean }) => c.cod
              )
            : false;

          const estimatedDays = available
            ? (srData.data.available_courier_companies[0]?.estimated_delivery_days as number | undefined) ?? null
            : null;

          const response: PincodeCheckResponse = {
            serviceable: available,
            codAvailable,
            estimatedDays,
          };

          return NextResponse.json(response, { status: 200 });
        }
      } catch (shiprocketError) {
        console.error("[check-pincode] Shiprocket API error:", shiprocketError);
        // Fall through to sandbox mode if Shiprocket call fails
      }
    }

    // ── Sandbox / demo mode ──
    // Returns serviceable=true for any valid 6-digit pincode.
    // Replace with live integration before launch.
    const sandboxResponse: PincodeCheckResponse = {
      serviceable: true,
      codAvailable: true,
      estimatedDays: 5,
    };

    return NextResponse.json(sandboxResponse, { status: 200 });
  } catch (error) {
    console.error("[check-pincode] Unexpected error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
