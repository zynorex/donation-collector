import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, bannerImage, targetAmount, deadline, categoryId } = await req.json();

    if (!title || !description || !targetAmount || !deadline || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        bannerImage,
        targetAmount: parseFloat(targetAmount),
        deadline: new Date(deadline),
        categoryId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
