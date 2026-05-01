import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { amount, eventId, message, isAnonymous } = body;

    if (!amount || !eventId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert amount to paise for Razorpay
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Create pending donation in DB
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        eventId,
        message,
        isAnonymous: isAnonymous || false,
        userId: session?.user?.id || null, // Allow guest donations if no session
        transactionId: order.id,
      },
    });

    return NextResponse.json({ order, donation }, { status: 200 });
  } catch (error) {
    console.error("Donation creation error:", error);
    return NextResponse.json({ error: "Failed to create donation order" }, { status: 500 });
  }
}
