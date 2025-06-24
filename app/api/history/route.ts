import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      questions: {
        take: 1,
        include: { grammars: { include: { grammar: true } } }
      }
    }
  });

  const list = sessions.map((s) => {
    const q = s.questions[0];
    const snippet = q ? q.stem.slice(0, 40) + (q.stem.length > 40 ? "..." : "") : "(无题目)";
    const grammars = q ? q.grammars.map((g) => g.grammar.name).join("，") : "";
    return { id: s.id, snippet, grammars, createdAt: s.createdAt.toISOString() };
  });

  return NextResponse.json(list);
} 