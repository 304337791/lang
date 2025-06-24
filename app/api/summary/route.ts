import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const favoriteQuestions = await prisma.favorite.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          grammars: { include: { grammar: true } },
          vocabularies: { include: { vocab: true } }
        }
      }
    }
  });

  const grammarMap: Record<string, number> = {};
  const vocabMap: Record<string, number> = {};

  for (const fav of favoriteQuestions) {
    for (const g of fav.question.grammars) {
      grammarMap[g.grammar.name] = (grammarMap[g.grammar.name] || 0) + 1;
    }
    for (const v of fav.question.vocabularies) {
      vocabMap[v.vocab.word] = (vocabMap[v.vocab.word] || 0) + 1;
    }
  }

  return NextResponse.json({ grammar: grammarMap, vocabulary: vocabMap });
} 