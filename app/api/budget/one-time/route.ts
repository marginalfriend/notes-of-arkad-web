import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod"; // For input validation
import { verifyAccessToken } from "@/lib/auth";

const oneTimeBudgetSchema = z.object({
  profileId: z.string().uuid(),
  name: z.string().min(1).max(255),
  oneTimeBudgetItemRequest: z
    .array(
      z.object({
        name: z.string().min(1).max(255),
        amount: z.number().positive(),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await verifyAccessToken(token);

  if (!result || !result.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findUnique({
    where: { id: result.id },
  });

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const { profileId, name } = data;

  if (!profileId) {
    return NextResponse.json(
      { error: "Profile ID is required" },
      { status: 400 }
    );
  }

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const profile = await prisma.profile.findUnique({
    where: { id: profileId, accountId: account.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  try {
    const validatedData = oneTimeBudgetSchema.parse(data);

    return await prisma.$transaction(async (tx) => {
      const oneTimeBudget = await tx.oneTimeBudget.create({
        data: {
          name: name,
          profileId: profileId,
        },
        include: {
          OneTimeBudgetItem: true,
        },
      });

      const { oneTimeBudgetItemRequest } = validatedData;

      if (!oneTimeBudgetItemRequest) {
        return NextResponse.json(
          { error: "One time budget item is required" },
          { status: 400 }
        );
      }

      for (const item of oneTimeBudgetItemRequest) {
        await tx.oneTimeBudgetItem.create({
          data: {
            name: item.name,
            amount: item.amount,
            oneTimeBudgetId: oneTimeBudget.id,
          },
        });
      }

      return NextResponse.json({ oneTimeBudget }, { status: 201 });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
