import { NextRequest, NextResponse } from "next/server";

// TODO: Implement rate limiting (e.g., using Upstash Redis or Vercel KV)
// to prevent contact form abuse. Recommended: 5 submissions per IP per hour.
// Example with @upstash/ratelimit:
//   const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h") });
//   const { success } = await ratelimit.limit(ip);
//   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function validateContact(body: unknown): { valid: true; data: ContactPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const { name, email, phone, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters." };
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { valid: false, error: "A valid email address is required." };
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return { valid: false, error: "Message must be at least 10 characters." };
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === "string" ? phone.trim() : undefined,
      message: message.trim(),
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const result = validateContact(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name, email, phone, message } = result.data;

    // Send email via Resend when configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL ?? "hello@refora.in";

    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: "REFORA Contact Form <noreply@refora.in>",
          to: contactEmail,
          replyTo: email,
          subject: `Contact form message from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : "",
            "",
            `Message:`,
            message,
          ]
            .filter(Boolean)
            .join("\n"),
        });

        // Send auto-reply to customer
        await resend.emails.send({
          from: "REFORA <noreply@refora.in>",
          to: email,
          subject: "We received your message — REFORA",
          text: `Hi ${name},\n\nThank you for getting in touch. We've received your message and will get back to you within 1–2 business days.\n\nThe REFORA Team\nhello@refora.in`,
        });
      } catch (emailError) {
        // Log but don't fail the response — the message was received
        console.error("[contact] Email send error:", emailError);
      }
    } else {
      // Log to console in development/sandbox mode
      console.log("[contact] [sandbox] Contact form submission:", {
        name,
        email,
        phone,
        message,
      });
    }

    return NextResponse.json(
      { message: "Message received. We'll be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
