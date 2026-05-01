import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(bodyText);

    // Razorpay sends various events. We care about payment.captured or order.paid
    // Let's handle order.paid
    if (body.event === "order.paid") {
      const orderId = body.payload.order.entity.id;
      
      // Update donation status
      const donation = await prisma.donation.findFirst({
        where: { transactionId: orderId },
      });

      if (donation) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: "SUCCESS" },
        });

        // Update event raised amount
        await prisma.event.update({
          where: { id: donation.eventId },
          data: {
            raisedAmount: {
              increment: donation.amount,
            },
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
