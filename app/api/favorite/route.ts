import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUserId } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const { questionId } = await req.json();
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const existing = await prisma.favorite.findFirst({
    where: { questionId, userId }
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favorite.create({ data: { questionId, userId } });
    return NextResponse.json({ favorited: true });
  }
} 