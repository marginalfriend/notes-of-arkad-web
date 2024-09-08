import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

// Input validation schema
const profileSchema = z.object({
  name: z.string().min(1).max(100),
});

// Helper function to get user ID from token
async function getUserIdFromToken(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (!token) throw new Error("No token provided");

  const payload = await verifyAccessToken(token);

  if (!payload) throw new Error("Invalid token");

  return payload.id;
}

// Create profile
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const body = await req.json();
    const validatedData = profileSchema.parse(body);

    const profile = await prisma.profile.create({
      data: {
        ...validatedData,
        accountId: userId,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Read all profiles for the user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);

    const profiles = await prisma.profile.findMany({
      where: { accountId: userId },
    });
    
    if (profiles.length === 0) {
      return NextResponse.json({ error: "No profiles found" }, { status: 404 });
    }

    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update profile
export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const body = await req.json();
    const { id, ...validatedData } = profileSchema
      .extend({ id: z.string() })
      .parse(body);

    const updatedProfile = await prisma.profile.updateMany({
      where: { id, accountId: userId },
      data: validatedData,
    });

    if (updatedProfile.count === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete profile
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      // Delete related records first
      await prisma.oneTimeBudgetExpense.deleteMany({
        where: {
          oneTimeBudgetItem: {
            oneTimeBudget: { profileId: id, profile: { accountId: userId } },
          },
        },
      });
      await prisma.oneTimeBudgetItem.deleteMany({
        where: {
          oneTimeBudget: { profileId: id, profile: { accountId: userId } },
        },
      });
      await prisma.oneTimeBudget.deleteMany({
        where: { profileId: id, profile: { accountId: userId } },
      });
      await prisma.recurringBudgetExpense.deleteMany({
        where: {
          recurringBudget: { profileId: id, profile: { accountId: userId } },
        },
      });
      await prisma.recurringBudget.deleteMany({
        where: { profileId: id, profile: { accountId: userId } },
      });
      await prisma.expense.deleteMany({
        where: { profileId: id, profile: { accountId: userId } },
      });

      // Finally, delete the profile
      const deletedProfile = await prisma.profile.deleteMany({
        where: { id, accountId: userId },
      });

      if (deletedProfile.count === 0) {
        throw new Error("Profile not found");
      }
    });

    return NextResponse.json({
      message: "Profile and related data deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
